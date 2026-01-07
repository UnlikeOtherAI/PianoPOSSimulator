import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT ?? 6080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const triggerHandler = (req, res) => {
  res.status(200).json({ ok: true });
};

app.post("/sim/trigger", triggerHandler);
app.get("/sim/trigger", triggerHandler);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`API simulator listening on port ${port}`);
});
