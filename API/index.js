import express from "express";

const app = express();
const port = process.env.PORT ?? 6080;

app.use(express.json());

const triggerHandler = (req, res) => {
  res.status(200).json({ ok: true });
};

app.post("/sim/trigger", triggerHandler);
app.get("/sim/trigger", triggerHandler);

app.listen(port, () => {
  console.log(`API simulator listening on port ${port}`);
});
