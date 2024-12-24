const rateLimit = require('express-rate-limit');

const failedRequestsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // start blocking after 20 requests
  skipSuccessfulRequests: true,
});

const successfullRequestsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 200, // start blocking after 100 requests
});

module.exports = {
  failedRequestsLimiter,
  successfullRequestsLimiter,
};
