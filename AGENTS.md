# Agent Instructions

## Before You Start

- Read `README.md`.
- Check for nested `AGENTS.md` files in any subdirectories you touch; follow the most specific instructions.

## Working Style

- If something is unknown or might be outdated, say so explicitly rather than guessing.
- Commit each turn.
- Path case corrections: when a user references a path with incorrect case, silently use the filesystem-correct case.
- Stay focused on the current request; ask before changing unrelated files or content.
- Parallel/unrelated changes are expected; do not mention or ask about them.
- If a required file already has unrelated changes, edit only what’s needed for the current request and leave everything else untouched.
- Worktree safety: never discard/revert uncommitted changes, especially ones not created in the current task context.
- No destructive commands unless explicitly requested (e.g., `git reset`, `git clean`, `git restore`, `rm`).
- Tests are the source of truth: only change tests when functionality changes or new functionality is added, and document the rationale. Never bend tests just to make them pass.
- Keep documentation updated: maintain `Docs/brief.md` for the simulator plan and keep `README.md` developer-facing only (what it is, how to launch, essentials). Avoid filler.

## Git and Delivery

- Never stage or commit files you didn’t edit.
- Do not mention or ask about a dirty git status or unrelated changes in responses.
- Run tests before pushing if code was changed.
- Always commit your changes and push them.

## Project Conventions

- This is a Node.js API only.
- Use `pnpm`.
- Use PostgreSQL (`psql`) for local debugging when needed.
