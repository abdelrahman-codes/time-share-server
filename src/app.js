require('dotenv').config();
const path = require('path');
const express = require('express');
const connection = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const V1Routes = require('./api/v1/modules/index');
const { ErrorMiddleware, LimiterMiddleware, ResponseMiddleware, NormalizeTextMiddleware } = require('./middlewares/index');
const ErrorHandler = require('./enums/errors');
const logger = require('./config/logger');

// Database connection
connection();

const app = express();

// set security HTTP headers
app.use(helmet());

// json body parser
app.use(express.json());

// enable cors
app.use(cors());

// sanitize request data
app.use(mongoSanitize());

app.use(NormalizeTextMiddleware);
// Common response handler
app.use(ResponseMiddleware);

// Request Logging Middleware
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Api running versions
app.use('/api/v1', V1Routes);

// adding limiter for successful requests (max 200 in 5 minutes)
// app.use(LimiterMiddleware.successfulRequestsLimiter);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  throw ErrorHandler.notFound({}, 'Invalid End Point');
});

// Common error handler
app.use(ErrorMiddleware);

// setup for upload images
// app.use('/public', express.static('public'));
app.use('/public', express.static(path.join(__dirname, 'public')));

module.exports = app;
