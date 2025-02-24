require('dotenv').config();
const http = require('http');
const app = require('./src/app');

const port = process.env.PORT || 8080;

const startServer = () => {
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
  // Handle server errors to restart gracefully
  server.on('error', (error) => {
    console.error('Server encountered an error:', error);
    // Optional: Add logic to gracefully close resources if needed
    setTimeout(startServer, 1000); // Restart server after 1 second
  });

  // Graceful shutdown on process termination
  process.on('SIGTERM', () => {
    console.log('SIGTERM received: shutting down gracefully');
    server.close(() => {
      console.log('Server shut down');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received: shutting down gracefully');
    server.close(() => {
      console.log('Server shut down');
      process.exit(0);
    });
  });

  return server;
};
startServer();
