function errorHandler(error, req, res, next) {
  const malformedJson = error instanceof SyntaxError && error.status === 400;
  const status = malformedJson ? 400 : error.status || 500;
  const message = malformedJson
    ? "Invalid JSON body"
    : status === 500
      ? "An error occurred, please try again later."
      : error.message;

  if (status >= 500) console.error(error.stack || error);
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
