import express from "express";
import bodyParser from "body-parser";

const PORT = 4005;
const app = express();
app.use(bodyParser.json());

const events = [];

app.get("/events", (req, res) => {
  res.send(events);
});

app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
