DOCTL ?= doctl
SPEC ?= app.yaml
SPEC_STAGING ?= app.staging.yaml
APP_ID ?= d7db9d17-0aa1-4db5-b29b-74f03bfa58c1
APP_ID_STAGING ?= <set-staging-app-id>
MIGRATION_NAME ?= baseline
MIGRATION_TEST_DB ?= piano-test

ifeq ($(firstword $(MAKECMDGOALS)),migrate)
MIGRATE_EXTRA := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
MIGRATE_MODE := $(strip $(firstword $(MIGRATE_EXTRA)))
ifeq ($(MIGRATE_MODE),)
MIGRATE_MODE := default
endif
endif
MIGRATE_MODE ?= default

ifeq ($(firstword $(MAKECMDGOALS)),read)
READ_EXTRA := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
READ_ENVIRONMENT := $(strip $(firstword $(READ_EXTRA)))
ifeq ($(READ_ENVIRONMENT),)
READ_ENVIRONMENT := production
endif
READ_SPEC_FILE := $(if $(filter staging,$(READ_ENVIRONMENT)),$(SPEC_STAGING),$(SPEC))
READ_APP_ID := $(if $(filter staging,$(READ_ENVIRONMENT)),$(APP_ID_STAGING),$(APP_ID))
endif

ifeq ($(firstword $(MAKECMDGOALS)),deploy)
DEPLOY_EXTRA := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
DEPLOY_ENVIRONMENT := $(strip $(firstword $(DEPLOY_EXTRA)))
ifeq ($(DEPLOY_ENVIRONMENT),)
DEPLOY_ENVIRONMENT := production
endif
DEPLOY_SPEC_FILE := $(if $(filter staging,$(DEPLOY_ENVIRONMENT)),$(SPEC_STAGING),$(SPEC))
DEPLOY_APP_ID := $(if $(filter staging,$(DEPLOY_ENVIRONMENT)),$(APP_ID_STAGING),$(APP_ID))
endif

.PHONY: install migrate launch read deploy staging test

staging:
	@:

install:
	@pnpm -C API install

migrate:
	@if [ "$(MIGRATE_MODE)" = "test" ]; then \
		clear; \
		echo "Running migration test cycle against '$(MIGRATION_TEST_DB)'..."; \
		BASE_URL="$${DATABASE_URL:-}"; \
		if [ -z "$$BASE_URL" ] && [ -f API/.env ]; then \
			BASE_LINE=$$(grep -E '^DATABASE_URL=' API/.env | tail -n 1); \
			if [ -n "$$BASE_LINE" ]; then \
				BASE_URL=$${BASE_LINE#DATABASE_URL=}; \
			fi; \
		fi; \
		if [ -z "$$BASE_URL" ]; then \
			BASE_URL="postgresql://piano@localhost:5432/piano"; \
		fi; \
		TARGET_DB="$(MIGRATION_TEST_DB)"; \
		if ! command -v python3 >/dev/null 2>&1; then \
			echo "python3 is required to compute test DATABASE_URL." >&2; \
			exit 1; \
		fi; \
		TMP_FILE=$$(mktemp); \
		TMP_SCRIPT=$$(mktemp).py; \
		printf '%s\n' \
			"import os, sys" \
			"from urllib.parse import urlparse, urlunparse" \
			"" \
			"base = os.environ.get('BASE_URL')" \
			"target = os.environ.get('TARGET_DB')" \
			"if not base:" \
			"    raise SystemExit('DATABASE_URL is not defined; set it in the environment or API/.env')" \
			"if not target:" \
			"    raise SystemExit('TARGET_DB is not set')" \
			"parsed = urlparse(base)" \
			"if not parsed.scheme or not parsed.netloc:" \
			"    raise SystemExit(f'Invalid DATABASE_URL: {base}')" \
			"test_uri = parsed._replace(path='/' + target)" \
			"admin_uri = parsed._replace(path='/postgres')" \
			"print(urlunparse(test_uri))" \
			"print(urlunparse(admin_uri))" \
			> "$$TMP_SCRIPT"; \
		if ! BASE_URL="$$BASE_URL" TARGET_DB="$$TARGET_DB" python3 "$$TMP_SCRIPT" >"$$TMP_FILE" 2>&1; then \
			cat "$$TMP_FILE" >&2; \
			rm -f "$$TMP_FILE" "$$TMP_SCRIPT"; \
			exit 1; \
		fi; \
		TEST_URL=$$(sed -n '1p' "$$TMP_FILE"); \
		ADMIN_URL=$$(sed -n '2p' "$$TMP_FILE"); \
		rm -f "$$TMP_FILE" "$$TMP_SCRIPT"; \
		if [ -z "$$TEST_URL" ] || [ -z "$$ADMIN_URL" ]; then \
			echo "Failed to derive target database URLs from $$BASE_URL" >&2; \
			exit 1; \
		fi; \
		if ! command -v psql >/dev/null 2>&1; then \
			echo "psql not found in PATH; install PostgreSQL client tools." >&2; \
			exit 1; \
		fi; \
		echo "Resetting database '$$TARGET_DB'..."; \
		psql "$$ADMIN_URL" -v ON_ERROR_STOP=1 -q -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$$TARGET_DB';" >/dev/null 2>&1 || true; \
		psql "$$ADMIN_URL" -v ON_ERROR_STOP=1 -q -c "DROP DATABASE IF EXISTS \"$$TARGET_DB\";" >/dev/null || exit 1; \
		psql "$$ADMIN_URL" -v ON_ERROR_STOP=1 -q -c "CREATE DATABASE \"$$TARGET_DB\";" >/dev/null || exit 1; \
		echo "Applying migrations to '$$TARGET_DB'..."; \
		DATABASE_URL="$$TEST_URL" pnpm -C API prisma:generate; \
		DATABASE_URL="$$TEST_URL" pnpm -C API exec prisma migrate deploy; \
		DATABASE_URL="$$TEST_URL" pnpm -C API exec prisma migrate status || true; \
		echo "Migration test complete."; \
	else \
		pnpm -C API prisma:generate; \
		pnpm -C API exec prisma migrate dev --name $(MIGRATION_NAME); \
	fi

launch: install
	@pnpm -C API start

test:
	@node API/sim/simulate-purchases.js

read:
	@if ! command -v $(DOCTL) >/dev/null 2>&1; then \
		echo "$(DOCTL) not found. Install doctl and run: doctl auth init" >&2; \
		exit 1; \
	fi
	@if [ "$(READ_ENVIRONMENT)" = "staging" ]; then \
		if [ -z "$(strip $(APP_ID_STAGING))" ] || [ "$(strip $(APP_ID_STAGING))" = "<set-staging-app-id>" ]; then \
			echo "APP_ID_STAGING is not set. Export APP_ID_STAGING before running 'make read staging'." >&2; \
			exit 1; \
		fi; \
	fi
	@if [ -z "$(strip $(READ_APP_ID))" ]; then \
		echo "Unable to determine target App ID for $(READ_ENVIRONMENT) read operation." >&2; \
		exit 1; \
	fi
	@target_env="$(READ_ENVIRONMENT)"; \
	spec_file="$(READ_SPEC_FILE)"; \
	app_id="$(READ_APP_ID)"; \
	echo "Saving $$target_env DigitalOcean spec to $$spec_file..."; \
	$(DOCTL) apps spec get "$$app_id" > "$$spec_file"

deploy:
	@if [ ! -f "$(DEPLOY_SPEC_FILE)" ]; then \
		echo "Spec $(DEPLOY_SPEC_FILE) not found" >&2; \
		exit 1; \
	fi
	@if ! command -v $(DOCTL) >/dev/null 2>&1; then \
		echo "$(DOCTL) not found. Install doctl and run: doctl auth init" >&2; \
		exit 1; \
	fi
	@if [ "$(DEPLOY_ENVIRONMENT)" = "staging" ]; then \
		if [ -z "$(strip $(APP_ID_STAGING))" ] || [ "$(strip $(APP_ID_STAGING))" = "<set-staging-app-id>" ]; then \
			echo "APP_ID_STAGING is not set. Export APP_ID_STAGING before running 'make deploy staging'." >&2; \
			exit 1; \
		fi; \
	fi
	@if [ -z "$(strip $(DEPLOY_APP_ID))" ]; then \
		echo "Unable to determine target App ID for $(DEPLOY_ENVIRONMENT) deployment." >&2; \
		exit 1; \
	fi
	@echo "Deploying $(DEPLOY_SPEC_FILE) to $(DEPLOY_ENVIRONMENT) app $(DEPLOY_APP_ID)..."
	@$(DOCTL) apps update $(DEPLOY_APP_ID) --spec $(DEPLOY_SPEC_FILE) --update-sources
