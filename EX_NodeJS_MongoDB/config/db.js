const { MongoClient } = require("mongodb");

// Địa chỉ MongoDB và tên database.
const client = new MongoClient("mongodb://127.0.0.1:27017", {
  serverSelectionTimeoutMS: 5000,
});
const db = client.db("school_db");

// Cho phép server.js và seed.js sử dụng client, db.
module.exports = { client, db };
