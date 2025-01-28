const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const ErrorHandler = require('./enums/errors');

const setupSocketIo = (server, app) => {
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  // Attach `io` to the app for global access
  app.io = io;
  app.set('socketIo', io);

  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.query?.token;

    if (!token) {
      throw ErrorHandler.dynamicError(403, 'Access denied', {});
    }

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
      socket.userId = decoded.sub;
      next();
    } catch (err) {
      throw ErrorHandler.dynamicError(403, 'Access denied', {});
    }
  });

  // Handle new socket connections
  io.on('connection', (socket) => {
    const userId = socket.userId;
    socket.join(userId);
    console.log(`User ${userId} connected and joined room ${userId}`);
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });

  return io;
};

module.exports = setupSocketIo;
