const express = require("express");
const articles = require("./articles");
const videos = require("./videos");

// Each router manages its own collection, initialized from db.json.
function createRouter(name, initialData) {
  const router = express.Router();
  const items = structuredClone(initialData);
  let nextId = Math.max(0, ...items.map((item) => item.id)) + 1;

  function validateBody(req, res, next) {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({ message: "Send a JSON object" });
    }
    if (req.method === "POST" || Object.hasOwn(req.body, "title")) {
      if (typeof req.body.title !== "string" || !req.body.title.trim()) {
        return res.status(400).json({ message: "A non-empty title is required" });
      }
    }
    next();
  }

  router.route("/")
    .get((req, res) => res.json(items))
    .post(validateBody, (req, res) => {
      const item = { ...req.body, id: nextId++ };
      items.push(item);
      res.status(201).json(item);
    })
    .put((req, res) => {
      res.status(403).send(`PUT operation not supported on /${name}`);
    })
    .delete((req, res) => {
      items.splice(0, items.length);
      res.status(200).send(`Deleting all ${name}`);
    });

  router.post("/:id", (req, res) => {
    res.status(403).send(`POST operation not supported on /${name}/${req.params.id}`);
  });

  router.use("/:id", (req, res, next) => {
    const id = Number(req.params.id);
    if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({ message: "ID must be a positive integer" });
    }
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ message: `${name} item not found` });
    }
    res.locals.index = index;
    next();
  });

  router.route("/:id")
    .get((req, res) => res.json(items[res.locals.index]))
    .put(validateBody, (req, res) => {
      const index = res.locals.index;
      // Keep the existing ID even if the request body contains another ID.
      items[index] = { ...items[index], ...req.body, id: items[index].id };
      res.json(items[index]);
    })
    .delete((req, res) => {
      items.splice(res.locals.index, 1);
      res.status(204).end();
    });

  return router;
}

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/articles", createRouter("articles", articles));
  app.use("/videos", createRouter("videos", videos));

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });
  app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ message: error.message });
  });
  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 3000;
  createApp().listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

module.exports = createApp;
