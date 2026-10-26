const jwt = require('jsonwebtoken');
module.exports = function authenticate(req, res, next) {
  const match = /^Bearer ([^\s]+)$/i.exec(req.get('Authorization') || '');
  if (!match) return res.status(401).json({ message: 'A Bearer token is required' });
  try {
    req.user = jwt.verify(match[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
