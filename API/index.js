import express from "express";

const app = express();
const port = process.env.PORT ?? 6080;

app.use(express.json());

app.post("/sim/trigger", (req, res) => {
  res.status(200).json({ ok: ":)" });
});

app.listen(port, () => {
  console.log(`API simulator listening on port ${port}`);
});
