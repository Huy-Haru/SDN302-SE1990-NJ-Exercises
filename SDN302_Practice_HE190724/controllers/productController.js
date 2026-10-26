const Product = require('../models/Product');
const Order = require('../models/Order');
const { HttpError, asyncHandler, bodyObject, text, number } = require('../middleware/validation');

function getInput(body, partial = false) {
  bodyObject(body);
  const data = {};

  for (const field of ['name', 'category', 'price', 'stock']) {
    if (!partial || Object.hasOwn(body, field)) {
      data[field] = ['name', 'category'].includes(field)
        ? text(body[field], field)
        : number(body[field], field);
    }
  }

  if (!Object.keys(data).length) throw new HttpError(400, 'Supply at least one product field');
  return data;
}

exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ _id: 1 });
  res.json(products);
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new HttpError(404, 'Product not found');
  res.json(product);
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(getInput(req.body));
  res.status(201).json(product);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new HttpError(404, 'Product not found');

  product.set(getInput(req.body, true));
  res.json(await product.save());
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new HttpError(404, 'Product not found');

  if (await Order.exists({ 'items.product_id': product._id })) {
    throw new HttpError(409, 'Product is referenced by an order');
  }

  await product.deleteOne();
  res.json({ message: 'Product deleted' });
});
