const express = require('express');
const articleRouter = require('./routes/articleRouter');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/articles', articleRouter);

app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((err, req, res, next) => {
  const badRequest = ['ValidationError', 'CastError', 'StrictModeError'].includes(err.name);
  res.status(err.status || (badRequest ? 400 : 500)).json({ message: err.message });
});
module.exports = app;
