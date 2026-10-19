const Article = require('../models/article');

exports.findAll = async (req, res, next) => {
  try {
    res.json(await Article.find());
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (error) { next(error); }
};

exports.findById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    res.json(article);
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    res.json(article);
  } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    res.status(204).send();
  } catch (error) { next(error); }
};

exports.deleteAll = async (req, res, next) => {
  try {
    await Article.deleteMany({});
    res.status(200).send('All articles deleted successfully.');
  } catch (error) { next(error); }
};
