import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT ?? 6080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const itemsPath = path.join(__dirname, "public", "data", "items.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const loadBusinessIds = () => {
  try {
    const raw = fs.readFileSync(itemsPath, "utf8");
    const data = JSON.parse(raw);
    return new Set((data.establishments || []).map((item) => item.id));
  } catch {
    return new Set();
  }
};

const BUSINESS_IDS = loadBusinessIds();

const resolveAuth = (req) => {
  const headerUser = req.header("x-sim-username");
  const headerPass = req.header("x-sim-password");
  if (headerUser || headerPass) {
    return { username: headerUser, password: headerPass };
  }
  if (req.body && (req.body.username || req.body.password)) {
    return { username: req.body.username, password: req.body.password };
  }
  return { username: null, password: null };
};

const isAuthorized = (req) => {
  const expectedUser = process.env.SIM_TRIGGER_USERNAME;
  const expectedPass = process.env.SIM_TRIGGER_PASSWORD;
  if (!expectedUser && !expectedPass) return true;
  const { username, password } = resolveAuth(req);
  return username === expectedUser && password === expectedPass;
};

const triggerHandler = (req, res) => {
  if (!isAuthorized(req)) {
    res.status(401).json({ ok: false, error: "Unauthorized" });
    return;
  }

  const requested = Array.isArray(req.body?.businessIds)
    ? req.body.businessIds
    : [];
  const normalized = requested.length
    ? requested.filter((id) => typeof id === "string")
    : Array.from(BUSINESS_IDS);
  const allowed = normalized.filter((id) => BUSINESS_IDS.has(id));
  const rejected = normalized.filter((id) => !BUSINESS_IDS.has(id));

  res.status(200).json({
    ok: true,
    businessIds: allowed,
    rejectedBusinessIds: rejected,
  });
};

app.post("/sim/trigger", triggerHandler);
app.get("/sim/trigger", triggerHandler);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`API simulator listening on port ${port}`);
});
