const express = require('express');
const commentsController = require('../controllers/commentsController');
const commentRouter = express.Router();
commentRouter.route('/')
  .get(commentsController.findAll)
  .post(commentsController.create);
module.exports = commentRouter;
