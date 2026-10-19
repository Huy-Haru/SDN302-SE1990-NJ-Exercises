const express = require('express');
const Article = require('../models/article');
const articleRouter = express.Router();
articleRouter.route('/')
  .get(async (req, res, next) => {
  try {
    res.json(await Article.find());
  } catch (error) { next(error); }
})
  .post(async (req, res, next) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (error) { next(error); }
})
  .put((req, res) => res.status(403).json('PUT operation not supported on /articles'))
  .delete(async (req, res, next) => {
  try {
    await Article.deleteMany({});
    res.status(200).send('All articles deleted successfully.');
  } catch (error) { next(error); }
});
articleRouter.route('/:id')
  .get(async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    res.json(article);
  } catch (error) { next(error); }
})
  .post((req, res) => res.status(403).end('POST operation not supported on /articles/' + req.params.id))
  .put(async (req, res, next) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    res.json(article);
  } catch (error) { next(error); }
})
  .delete(async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    res.status(204).send();
  } catch (error) { next(error); }
});
module.exports = articleRouter;
