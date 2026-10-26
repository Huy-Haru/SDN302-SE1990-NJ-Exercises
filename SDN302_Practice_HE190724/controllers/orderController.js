const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { HttpError, asyncHandler, bodyObject, objectId, text } = require('../middleware/validation');
async function prepareOrder(body, existing) {
  bodyObject(body);
  const partial = Boolean(existing);
  const allowed = ['customer_id', 'items', 'payment_method', 'status', 'order_date'];
  if (partial && !allowed.some(key => Object.hasOwn(body, key))) throw new HttpError(400, 'Supply at least one order field');
  const data = {};
  if (!partial || Object.hasOwn(body, 'customer_id')) {
    data.customer_id = objectId(body.customer_id, 'customer_id');
    if (!await Customer.exists({ _id: data.customer_id })) throw new HttpError(400, 'Customer does not exist');
  }
  for (const key of ['payment_method', 'status']) {
    if (!partial || Object.hasOwn(body, key)) data[key] = text(body[key], key);
  }
  if (Object.hasOwn(body, 'order_date')) {
    if (typeof body.order_date !== 'string' || !/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(body.order_date) || !Number.isFinite(Date.parse(body.order_date))) throw new HttpError(400, 'order_date must be an ISO date string');
    data.order_date = new Date(body.order_date);
  } else if (!partial) data.order_date = new Date();
  if (!partial || Object.hasOwn(body, 'items')) {
    if (!Array.isArray(body.items) || body.items.length === 0) throw new HttpError(400, 'items must contain at least one product');
    const quantities = new Map();
    for (const item of body.items) {
      bodyObject(item);
      const id = objectId(item.product_id, 'product_id');
      if (!Number.isSafeInteger(item.quantity) || item.quantity < 1) throw new HttpError(400, 'quantity must be an integer >= 1');
      const quantity = (quantities.get(id) || 0) + item.quantity;
      if (!Number.isSafeInteger(quantity)) throw new HttpError(400, 'quantity is too large');
      quantities.set(id, quantity);
    }
    const products = await Product.find({ _id: { $in: [...quantities.keys()] } });
    if (products.length !== quantities.size) throw new HttpError(400, 'One or more products do not exist');
    data.items = [...quantities].map(([id, quantity]) => {
      const product = products.find(p => p.id === id);
      if (quantity > product.stock) throw new HttpError(400, `Insufficient stock for ${product.name}`);
      const total = product.price * quantity;
      if (!Number.isFinite(total)) throw new HttpError(400, 'Item total is too large');
      return { product_id: product._id, quantity, price_at_order: product.price, total };
    });
    data.total_amount = data.items.reduce((sum, item) => sum + item.total, 0);
    if (!Number.isFinite(data.total_amount)) throw new HttpError(400, 'Order total is too large');
  }
  return data;
};


const populate = query => query.populate('customer_id').populate('items.product_id');

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await populate(Order.find().sort({ _id: 1 }));
  res.json(orders);
});

exports.getOrder = asyncHandler(async (req, res) => {
  const order = await populate(Order.findById(req.params.id));
  if (!order) throw new HttpError(404, 'Order not found');
  res.json(order);
});

exports.createOrder = asyncHandler(async (req, res) => {
  const order = await Order.create(await prepareOrder(req.body));
  res.status(201).json(order);
});

exports.updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new HttpError(404, 'Order not found');
  order.set(await prepareOrder(req.body, order));
  res.json(await order.save());
});

exports.deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) throw new HttpError(404, 'Order not found');
  res.json({ message: 'Order deleted' });
});
