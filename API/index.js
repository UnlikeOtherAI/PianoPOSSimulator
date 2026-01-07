import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import swaggerUiDist from "swagger-ui-dist";

const app = express();
const port = process.env.PORT ?? 6080;

app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

const openApiPath = path.join(__dirname, "..", "Docs", "piano.api.json");
const swaggerAssetPath = swaggerUiDist.getAbsoluteFSPath();

const swaggerIndexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Piano SIM Swagger</title>
    <link rel="stylesheet" href="./swagger-ui.css" />
    <style>
      :root {
        --sim-ink: #1d1b16;
        --sim-cream: #f7f2ea;
        --sim-card: #fffaf0;
        --sim-muted: #4b443b;
        --sim-border: #e2d6c2;
      }
      body {
        margin: 0;
        background: var(--sim-cream);
        color: var(--sim-ink);
        font-family: "Georgia", "Times New Roman", serif;
      }
      .sim-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 28px 32px 12px;
      }
      .sim-header img {
        width: 52px;
        height: 52px;
      }
      .sim-header h1 {
        margin: 0;
        font-size: 20px;
        letter-spacing: 2px;
      }
      .sim-header p {
        margin: 4px 0 0;
        color: var(--sim-muted);
        font-size: 13px;
      }
      .swagger-ui .topbar {
        background: var(--sim-ink);
      }
      .swagger-ui .topbar a span {
        color: #fffaf0;
      }
      .swagger-ui .opblock {
        border-color: var(--sim-border);
        background: var(--sim-card);
      }
      .swagger-ui .opblock .opblock-summary {
        border-color: var(--sim-border);
      }
      .swagger-ui .btn.execute {
        background-color: var(--sim-ink);
        border-color: var(--sim-ink);
      }
      .swagger-ui .btn.authorize {
        background-color: var(--sim-ink);
        border-color: var(--sim-ink);
        color: #fffaf0;
      }
      .swagger-ui .info .title {
        font-family: "Georgia", "Times New Roman", serif;
      }
      .swagger-ui .wrapper {
        padding: 0 24px 40px;
      }
    </style>
  </head>
  <body>
    <header class="sim-header">
      <img src="/assets/wolf.png" alt="Unlike Other AI" />
      <div>
        <h1>Piano SIM</h1>
        <p>by Unlike Other AI agency</p>
      </div>
    </header>
    <div id="swagger-ui"></div>
    <script src="./swagger-ui-bundle.js"></script>
    <script src="./swagger-ui-standalone-preset.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "./openapi.json",
        dom_id: "#swagger-ui",
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: "StandaloneLayout"
      });
    </script>
  </body>
</html>`;

const SIM_ACCESS_TOKEN = "sim_access_token";
const SIM_REFRESH_TOKEN = "sim_refresh_token";
const SIM_AUTH_CODE = "sim_auth_code";
const SIM_CLIENT_ID = "sim_client_id";
const SIM_CLIENT_SECRET = "sim_client_secret";

const buildRedirectUrl = (redirectUri, params) => {
  try {
    const url = new URL(redirectUri);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
    return url.toString();
  } catch {
    return null;
  }
};

const buildAuthorizeHtml = (redirectUri, state) => {
  const redirectUrl = redirectUri
    ? buildRedirectUrl(redirectUri, { code: SIM_AUTH_CODE, state })
    : null;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Piano SIM</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="min-h-screen bg-[#f7f2ea] flex items-center justify-center px-6">
    <div class="w-full max-w-md rounded-2xl border border-[#e2d6c2] bg-[#fffaf0] px-8 py-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
      <img class="mx-auto mb-6 h-20 w-20" src="/assets/wolf.png" alt="Unlike Other AI" />
      <h1 class="text-3xl font-semibold tracking-wide text-[#1d1b16]">Piano SIM</h1>
      <p class="mt-2 text-sm text-[#4b443b]">by Unlike Other AI agency</p>
      <button
        id="continue-button"
        class="mt-8 w-full rounded-full bg-[#1d1b16] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-[#fffaf0] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        ${redirectUrl ? "" : "disabled"}
      >
        Continue
      </button>
      ${
        redirectUrl
          ? ""
          : "<p class=\"mt-6 text-xs text-[#6a5f52]\">Missing or invalid redirect_uri.</p>"
      }
    </div>
    <script>
      const redirectUrl = ${JSON.stringify(redirectUrl ?? "")};
      const button = document.getElementById("continue-button");
      if (button && redirectUrl) {
        button.addEventListener("click", () => {
          window.location.href = redirectUrl;
        });
      }
    </script>
  </body>
</html>`;
};

const authorizeHandler = (req, res) => {
  const { redirect_uri: redirectUri, state } = req.query;
  res.status(200).type("html").send(buildAuthorizeHtml(redirectUri, state));
};

const tokenHandler = (req, res) => {
  res.status(200).json({
    access_token: SIM_ACCESS_TOKEN,
    token_type: "Bearer",
    expires_in: 3600,
    refresh_token: SIM_REFRESH_TOKEN,
    scope: "orders documents inventory",
  });
};

const revokeHandler = (req, res) => {
  res.status(200).json({ revoked: true });
};

const introspectHandler = (req, res) => {
  res.status(200).json({
    active: true,
    token: SIM_ACCESS_TOKEN,
    token_type: "Bearer",
    exp: Math.floor(Date.now() / 1000) + 3600,
    scope: "orders documents inventory",
  });
};

const registerHandler = (req, res) => {
  res.status(201).json({
    client_id: SIM_CLIENT_ID,
    client_secret: SIM_CLIENT_SECRET,
    client_name: "Piano SIM Client",
    redirect_uris: ["http://localhost:5173/callback"],
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    token_endpoint_auth_method: "client_secret_post",
  });
};

const userInfoHandler = (req, res) => {
  res.status(200).json({
    sub: "sim-user",
    email: "sim.user@example.com",
    name: "Piano Sim User",
  });
};

const authorizationServerMetadataHandler = (req, res) => {
  res.status(200).json({
    issuer: "http://localhost:6080",
    authorization_endpoint: "http://localhost:6080/oauth/authorize",
    token_endpoint: "http://localhost:6080/oauth/token",
    jwks_uri: "http://localhost:6080/.well-known/jwks.json",
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
  });
};

const protectedResourceMetadataHandler = (req, res) => {
  res.status(200).json({
    resource: "http://localhost:6080",
    authorization_servers: ["http://localhost:6080"],
  });
};

const loginHandler = (req, res) => {
  res.status(200).json({ access_token: SIM_ACCESS_TOKEN });
};

const whoAmIHandler = (req, res) => {
  res.status(200).json({
    accountId: "urn:account:sim-001",
    type: "APPLICATION",
    email: "sim.user@example.com",
    tenantPermissions: { "urn:tenant:sim": ["READ", "WRITE"] },
    establishmentPermissions: { "urn:establishment:sim": ["READ", "WRITE"] },
  });
};

const pairHandler = (req, res) => {
  const establishments = Array.isArray(req.body?.establishments)
    ? req.body.establishments
    : [];
  const credentials =
    establishments.length > 0
      ? establishments.map((establishment) => ({
          sourceId: establishment?.sourceId ?? "SIM-EST-001",
          clientId: SIM_CLIENT_ID,
          clientSecret: SIM_CLIENT_SECRET,
        }))
      : [
          {
            sourceId: "SIM-EST-001",
            clientId: SIM_CLIENT_ID,
            clientSecret: SIM_CLIENT_SECRET,
          },
        ];

  res.status(200).json({ credentials });
};

const triggerHandler = (req, res) => {
  res.status(200).json({ ok: ":)" });
};

app.post("/sim/trigger", triggerHandler);
app.get("/sim/trigger", triggerHandler);

app.get("/oauth/authorize", authorizeHandler);
app.post("/oauth/token", tokenHandler);
app.post("/oauth/revoke", revokeHandler);
app.post("/oauth/introspect", introspectHandler);
app.post("/oauth/register", registerHandler);
app.get("/oauth/userinfo", userInfoHandler);
app.get("/.well-known/oauth-authorization-server", authorizationServerMetadataHandler);
app.get("/.well-known/oauth-protected-resource/mcp", protectedResourceMetadataHandler);
app.post("/api/v1/auth/login", loginHandler);
app.get("/api/v1/auth/whoami", whoAmIHandler);
app.post("/api/v1/auth/pair", pairHandler);

app.use("/swagger", express.static(swaggerAssetPath, { index: false }));
app.get("/swagger", (req, res) => {
  res.status(200).type("html").send(swaggerIndexHtml);
});
app.get("/swagger/openapi.json", (req, res) => {
  try {
    const spec = fs.readFileSync(openApiPath, "utf8");
    res.status(200).type("json").send(spec);
  } catch {
    res.status(500).json({ error: "OpenAPI spec not available." });
  }
});

app.listen(port, () => {
  console.log(`API simulator listening on port ${port}`);
});
