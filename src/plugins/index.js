const registerRouters = require("./router");
const registerError = require("./error");
const registerLog = require("./log");
const registerBody = require("./body");
const register404 = require("./404");
/**
 * 注册所有插件
 * @param {Object} app - Koa 实例
 */
function registerPlugins(app) {
  // 全局错误处理中间件
  registerError(app);

  // 请求日志中间件
  registerLog(app);

  // 请求体解析中间件
  registerBody(app);

  // 注册路由
  registerRouters(app);

  // 404错误处理
  register404(app);
}

module.exports = registerPlugins;
