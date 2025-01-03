const ErrorMiddleware = require("../middleware/error");

const register404 = (app) => {
  app.use(ErrorMiddleware.handle404);
};

module.exports = register404;
