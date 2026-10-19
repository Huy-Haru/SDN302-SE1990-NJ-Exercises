const mongoose = require('mongoose');
const app = require('./app');
async function start() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ex15', { serverSelectionTimeoutMS: 5000 });
  const server = app.listen(process.env.PORT || 3000, () => console.log('API listening on port ' + server.address().port));
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => server.close(async () => { await mongoose.disconnect(); }));
  }
  server.on('error', async error => { console.error(error.message); await mongoose.disconnect(); process.exitCode = 1; });
}
start().catch(error => { console.error(error.message); process.exitCode = 1; });
