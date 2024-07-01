import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";

const PORT = 4000;
const app = express();
app.use(bodyParser.json());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  const post = {
    id,
    title,
  };

  posts[id] = post;

  fetch("http://event-clusterip-srv/events", {
    method: "POST",
    body: JSON.stringify({
      type: "PostCreated",
      data: post,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  res.status(201).send(posts[id]);
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
