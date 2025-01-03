const LogMiddleware = require('../middleware/log');

const registerLog = (app) => {
  app.use(LogMiddleware.logRequest);
  app.use(LogMiddleware.logAccess);
  app.use(LogMiddleware.logSlowRequests(1000));
};

module.exports = registerLog;
