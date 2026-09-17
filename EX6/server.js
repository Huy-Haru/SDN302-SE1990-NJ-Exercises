const express = require("express");
const fs = require("node:fs");
const path = require("node:path");

function createApp(dataFile = path.join(__dirname, "data.json")) {
  const app = express();
  app.use(express.json());

  app.get("/data", (req, res, next) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataFile, "utf8"));
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/update", (req, res, next) => {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({ message: "Send a JSON object" });
    }

    try {
      fs.writeFileSync(dataFile, JSON.stringify(req.body, null, 2) + "\n");
      res.json({ message: "The data has been updated" });
    } catch (error) {
      next(error);
    }
  });

  app.use((error, req, res, next) => {
    const status = error.status || 500;
    res.status(status).json({
      message: status === 500 ? "Unable to read or update data.json" : error.message,
    });
  });

  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 3000;
  createApp().listen(port, () => {
    console.log(`Data server running at http://localhost:${port}`);
  });
}

module.exports = createApp;
