const express = require("express");
const initialArticles = require("../articles");
const HttpError = require("../errors/HttpError");

const router = express.Router();
const articles = structuredClone(initialArticles);
let nextId = Math.max(0, ...articles.map((article) => article.id)) + 1;

function validateBody(req, res, next) {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return next(new HttpError(400, "Send a JSON object"));
  }
  if (req.method === "POST" || Object.hasOwn(req.body, "title")) {
    if (typeof req.body.title !== "string" || !req.body.title.trim()) {
      return next(new HttpError(400, "A non-empty title is required"));
    }
  }
  next();
}

router.get("/", (req, res) => res.json(articles));

router.post("/", validateBody, (req, res) => {
  const article = { ...req.body, id: nextId++ };
  articles.push(article);
  res.status(201).json(article);
});

router.put("/", (req, res) => {
  res.status(403).send("PUT operation not supported on /articles");
});

router.delete("/", (req, res) => {
  articles.splice(0, articles.length);
  res.status(200).send("Deleting all articles");
});

router.post("/:id", (req, res) => {
  res
    .status(403)
    .send(`POST operation not supported on /articles/${req.params.id}`);
});

router.use("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(id) || id < 1) {
    return next(new HttpError(400, "ID must be a positive integer"));
  }
  const index = articles.findIndex((article) => article.id === id);
  if (index === -1) {
    return next(new HttpError(404, "Article not found"));
  }
  res.locals.index = index;
  next();
});

router.get("/:id", (req, res) => res.json(articles[res.locals.index]));

router.put("/:id", validateBody, (req, res) => {
  const index = res.locals.index;
  articles[index] = { ...articles[index], ...req.body, id: articles[index].id };
  res.json(articles[index]);
});

router.delete("/:id", (req, res) => {
  articles.splice(res.locals.index, 1);
  res.status(204).end();
});

module.exports = router;
