/**
 * 应用程序入口文件
 */

const Koa = require("koa");
require("dotenv").config();
const sequelize = require("./config/db");

// 导入工具类
const Logger = require("./utils/logger");
const registerPlugins = require("./plugins");

// 创建Koa应用实例
const app = new Koa();

// 注册插件
registerPlugins(app);

// 启动服务器
const port = process.env.PORT || 3000;
app.listen(port, () => {
  Logger.info(`服务器已启动，监听端口 ${port}`);
  Logger.info(`环境: ${process.env.NODE_ENV || "development"}`);

  // 打印一些有用的信息
  Logger.info("应用信息:", {
    nodeVersion: process.version,
    platform: process.platform,
    pid: process.pid,
    uptime: process.uptime(),
  });
});

// 优雅关闭
process.on("SIGINT", () => {
  Logger.info("正在关闭服务器...");
  // 关闭数据库连接
  sequelize.close();
  Logger.info("数据库连接已关闭");
  
  process.exit(0);
});

module.exports = app;
