const express = require("express");
const articleRouter = require("./routers/articleRouter");
const videoRouter = require("./routers/videoRouter");

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/articles", articleRouter);
  app.use("/videos", videoRouter);

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
