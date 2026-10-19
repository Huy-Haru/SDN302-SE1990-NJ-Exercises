const express = require('express');
const articlesController = require('../controllers/articlesController');
const articleRouter = express.Router();
articleRouter.route('/')
  .get(articlesController.findAll)
  .post(articlesController.create)
  .put((req, res) => res.status(403).json('PUT operation not supported on /articles'))
  .delete(articlesController.deleteAll);
articleRouter.route('/:id')
  .get(articlesController.findById)
  .post((req, res) => res.status(403).end('POST operation not supported on /articles/' + req.params.id))
  .put(articlesController.update)
  .delete(articlesController.delete);
module.exports = articleRouter;
