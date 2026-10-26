const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Order = require('./models/Order');

async function seed() {
  await connectDB();

  // Extended JSON preserves the supplied ObjectIds and dates.
  const readData = name => mongoose.mongo.BSON.EJSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', name + '.json'), 'utf8')
  );

  const customers = readData('customers');
  const products = readData('products');
  const orders = readData('orders');
  const customerIds = new Set(customers.map(customer => String(customer._id)));
  const productIds = new Set(products.map(product => String(product._id)));

  for (const order of orders) {
    if (!customerIds.has(String(order.customer_id))
      || order.items.some(item => !productIds.has(String(item.product_id)))) {
      throw new Error('Invalid references in data files');
    }
  }

  for (const [Model, documents] of [[Customer, customers], [Product, products], [Order, orders]]) {
    for (const document of documents) await new Model(document).validate();
    await Model.init();

    // Add missing sample records without overwriting existing changes.
    await Model.bulkWrite(documents.map(document => ({
      updateOne: {
        filter: { _id: document._id },
        update: { $setOnInsert: document },
        upsert: true,
        timestamps: false
      }
    })));
  }

  console.log({
    customers: await Customer.countDocuments(),
    products: await Product.countDocuments(),
    orders: await Order.countDocuments()
  });
}

seed()
  .catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
