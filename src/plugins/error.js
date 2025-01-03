const ErrorMiddleware = require('../middleware/error');

const registerError = (app) => {
  app.use(ErrorMiddleware.handleError);
};

module.exports = registerError;
