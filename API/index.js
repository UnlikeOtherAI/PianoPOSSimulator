import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Establishment, PurchaseGenerator } from "./sim/purchase-generator.js";
import { TriggerPlanner } from "./sim/trigger-planner.js";

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

const loadBusinessInfo = () => {
  try {
    const raw = fs.readFileSync(itemsPath, "utf8");
    const data = JSON.parse(raw);
    return (data.establishments || []).reduce((acc, item) => {
      acc[item.id] = { name: item.name, logo: item.logo };
      return acc;
    }, {});
  } catch {
    return {};
  }
};

const BUSINESS_IDS = loadBusinessIds();
const BUSINESS_INFO = loadBusinessInfo();
const ID_TO_ESTABLISHMENT = {
  "urn:establishment:sim-pub-001": Establishment.ROCK_BOTTOM,
  "urn:establishment:sim-petrol-001": Establishment.SCOTTISH_DIESEL,
  "urn:establishment:sim-shop-001": Establishment.GET_NAKED,
  "urn:establishment:sim-truck-001": Establishment.LA_MORDIDA,
};

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

  const planner = new TriggerPlanner();
  const plan = planner.getPlan();
  const results = allowed.map((id) => {
    const establishment = ID_TO_ESTABLISHMENT[id];
    if (!establishment) {
      return {
        id,
        name: BUSINESS_INFO[id]?.name ?? "Unknown",
        logo: BUSINESS_INFO[id]?.logo ?? "/assets/wolf.png",
        orders: [],
      };
    }
    const generator = new PurchaseGenerator(establishment);
    const count = plan[establishment] ?? 0;
    const orders = [];
    for (let i = 0; i < count; i += 1) {
      const generated = generator.generateOrders();
      orders.push(...generated.orders);
    }
    return {
      id,
      name: BUSINESS_INFO[id]?.name ?? "Unknown",
      logo: BUSINESS_INFO[id]?.logo ?? "/assets/wolf.png",
      orders,
    };
  });

  res.status(200).json({
    ok: true,
    businessIds: allowed,
    rejectedBusinessIds: rejected,
    plan,
    results,
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
