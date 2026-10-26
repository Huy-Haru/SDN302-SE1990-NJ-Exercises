const jwt = require('jsonwebtoken');
const members = require('../data/members.json');

exports.createToken = (req, res) => {
  const { name, pass } = req.body || {};
  const member = typeof name === 'string' && typeof pass === 'string'
    && members.find(member => member.name === name && member.pass === pass);

  if (!member) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ name: member.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, token_type: 'Bearer', expires_in: 3600 });
};
