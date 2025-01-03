/**
 * 数据库连接配置文件
 * 使用Sequelize ORM连接MySQL数据库
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

// 创建Sequelize实例
const sequelize = new Sequelize(
  process.env.DB_NAME,       // 数据库名
  process.env.DB_USER,       // 用户名
  process.env.DB_PASSWORD,   // 密码
  {
    host: process.env.DB_HOST,   // 数据库主机地址
    dialect: 'mysql',            // 数据库类型
    port: process.env.DB_PORT,   // 端口号
    
    // 连接池配置
    pool: {
      max: 10,      // 连接池中最大连接数
      min: 0,       // 连接池中最小连接数
      acquire: 30000,   // 获取连接最大等待时间
      idle: 10000       // 连接最大空闲时间
    },
    
    // 自动重试配置
    retry: {
      // 匹配需要重试的错误
      match: [
        /Deadlock/i,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
        /TimeoutError/,
        /PROTOCOL_CONNECTION_LOST/
      ],
      max: 5    // 最大重试次数
    },
    
    logging: false     // 关闭SQL语句日志
  }
);

// 测试数据库连接
sequelize.authenticate()
  .then(() => {
    console.log('数据库连接成功。');
  })
  .catch(err => {
    console.error('数据库连接失败:', err);
  });

module.exports = sequelize; 