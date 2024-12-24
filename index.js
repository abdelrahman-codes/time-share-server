require('dotenv').config();
const os = require('os');
const cluster = require('cluster');
const http = require('http');
const app = require('./src/app'); // Import the app setup

const port = process.env.PORT || 8000;
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Optionally restart the worker
    cluster.fork();
  });
} else {
  const server = http.createServer(app); // Use the HTTP server

  server.listen(port, () => {
    console.log(`Worker ${process.pid} is listening on port ${port}`);
  });
}
