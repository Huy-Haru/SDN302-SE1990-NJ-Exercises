const router = require('express').Router();
const productController = require('../controllers/productController');
const { validateId } = require('../middleware/validation');

router.param('id', validateId);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
