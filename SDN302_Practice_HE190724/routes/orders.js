const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { validateId } = require('../middleware/validation');

router.param('id', validateId);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
