class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
function bodyObject(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new HttpError(400, 'Body must be a JSON object');
}
function objectId(value, field = 'id') {
  if (typeof value !== 'string' || !/^[a-f\d]{24}$/i.test(value)) throw new HttpError(400, `${field} must be a valid ObjectId`);
  return value.toLowerCase();
}
function text(value, field) {
  if (typeof value !== 'string' || !value.trim()) throw new HttpError(400, `${field} is required and must be a non-empty string`);
  return value.trim();
}
function number(value, field, min = 0) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min) throw new HttpError(400, `${field} must be a number >= ${min}`);
  return value;
}
function validateId(req, res, next, id) {
  try { objectId(id); next(); }
  catch (error) { next(error); }
}
module.exports = { HttpError, asyncHandler, bodyObject, objectId, text, number, validateId };
