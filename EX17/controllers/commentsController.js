const Comment = require('../models/comment');

exports.findAll = async (req, res, next) => {
  try {
    res.json(await Comment.find().populate('article'));
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const comment = await Comment.create(req.body);
    res.status(201).json(comment);
  } catch (error) { next(error); }
};
