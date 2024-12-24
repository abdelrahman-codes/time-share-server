const DailyRotateFile = require('winston-daily-rotate-file');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

// Create the logger
const logger = createLogger({
  level: 'info', // Default log level
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
    colorize(), // Colorize logs for console
    logFormat, // Custom format
  ),
  transports: [
    new transports.Console(), // Log to console
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d', // Keep logs for 14 days
    }),
  ],
});

// Export the logger
module.exports = logger;
