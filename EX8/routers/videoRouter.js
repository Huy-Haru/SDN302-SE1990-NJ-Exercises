const express = require("express");
const initialVideos = require("../videos");
const HttpError = require("../errors/HttpError");

const router = express.Router();
const videos = structuredClone(initialVideos);
let nextId = Math.max(0, ...videos.map((video) => video.id)) + 1;

function validateBody(req, res, next) {
  if (typeof req.body.title !== "string" || req.body.title.trim() === "") {
    return next(new HttpError(400, "A non-empty title is required"));
  }
  next();
}

router.get("/", (req, res) => res.json(videos));

router.post("/", validateBody, (req, res) => {
  const video = { ...req.body, id: nextId++ };
  videos.push(video);
  res.status(201).json(video);
});

router.put("/", (req, res) => {
  res.status(403).send("PUT operation not supported on /videos");
});

router.delete("/", (req, res) => {
  videos.splice(0, videos.length);
  res.status(200).send("Deleting all videos");
});

router.post("/:id", (req, res) => {
  res
    .status(403)
    .send(`POST operation not supported on /videos/${req.params.id}`);
});

router.use("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return next(new HttpError(400, "ID must be a positive integer"));
  }
  const index = videos.findIndex((video) => video.id === id);
  if (index === -1) {
    return next(new HttpError(404, "Video not found"));
  }
  res.locals.index = index;
  next();
});

router.get("/:id", (req, res) => res.json(videos[res.locals.index]));

router.put("/:id", validateBody, (req, res) => {
  const index = res.locals.index;
  videos[index] = { ...videos[index], ...req.body, id: videos[index].id };
  res.json(videos[index]);
});

router.delete("/:id", (req, res) => {
  videos.splice(res.locals.index, 1);
  res.status(204).end();
});

module.exports = router;
