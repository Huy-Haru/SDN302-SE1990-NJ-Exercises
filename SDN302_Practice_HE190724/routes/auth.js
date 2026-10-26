const router = require('express').Router();
const authController = require('../controllers/authController');

router.post('/tokens', authController.createToken);

module.exports = router;
