const express = require('express');
const Comment = require('../models/comment');
const commentRouter = express.Router();
commentRouter.route('/')
  .get(async (req, res, next) => {
  try {
    res.json(await Comment.find().populate('article'));
  } catch (error) { next(error); }
})
  .post(async (req, res, next) => {
  try {
    const comment = await Comment.create(req.body);
    res.status(201).json(comment);
  } catch (error) { next(error); }
});
module.exports = commentRouter;
