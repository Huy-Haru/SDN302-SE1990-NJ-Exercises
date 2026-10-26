const app = require('./app');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

async function start() {
  await connectDB();

  const port = Number(process.env.PORT || 9999);
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  server.on('error', async error => {
    console.error(error.message);
    await mongoose.disconnect();
    process.exitCode = 1;
  });

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => {
      server.close(async () => {
        await mongoose.disconnect();
        process.exit(0);
      });
    });
  }
}

start().catch(async error => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
