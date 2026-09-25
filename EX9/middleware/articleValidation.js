function validationError(res, message) {
  return res.status(400).json({ error: message });
}

function validateArticle(req, res, next) {
  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return validationError(res, "Request body must be a JSON object");
  }

  const requiredFields = ["title", "date", "text"];
  const missing = requiredFields.filter(
    (field) => typeof body[field] !== "string" || !body[field].trim(),
  );
  if (missing.length > 0) {
    return validationError(res, `Missing required fields: ${missing.join(", ")}`);
  }
  next();
}

function validateArticleDate(req, res, next) {
  const value = req.body.date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return validationError(res, "Date must use YYYY-MM-DD format");
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return validationError(res, "Date must be a valid calendar date");
  }
  next();
}

function validateArticleText(req, res, next) {
  const length = req.body.text.trim().length;
  if (length < 10 || length > 1000) {
    return validationError(res, "Text must contain between 10 and 1000 characters");
  }
  next();
}

module.exports = { validateArticle, validateArticleDate, validateArticleText };
