require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const aiRoutes = require("./ai");
app.use("/ai", aiRoutes);

let posts = [];

const startCron = require("./cron");
startCron(posts);

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.post("/posts", (req, res) => {
  const post = {
    id: Date.now().toString(),
    views: 0,
    status: "Upcoming",
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  posts.push(post);
  res.json(post);
});

app.delete("/posts/:id", (req, res) => {
  posts = posts.filter((p) => p.id !== req.params.id);
  res.json({ success: true });
});

app.patch("/posts/:id/view", (req, res) => {
  posts = posts.map((p) =>
    p.id === req.params.id
      ? { ...p, views: (p.views || 0) + 1 }
      : p
  );
  res.json({ success: true });
});

app.listen(5000, () => {
  console.log("✅ Backend running at http://localhost:5000");
});
