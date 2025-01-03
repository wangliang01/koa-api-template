/**
 * 认证配置文件
 * 包含JWT配置和其他认证相关设置
 */

require('dotenv').config();

module.exports = {
  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET,           // JWT密钥
    expiresIn: process.env.JWT_EXPIRES_IN,    // Token过期时间
    issuer: 'koa-gold-console',              // Token发行者
    audience: 'koa-gold-console-client'       // Token接收者
  },

  // 密码策略
  passwordPolicy: {
    minLength: 8,                    // 最小长度
    requireUppercase: true,          // 需要大写字母
    requireLowercase: true,          // 需要小写字母
    requireNumbers: true,            // 需要数字
    requireSpecialChars: true        // 需要特殊字符
  },

  // 登录尝试限制
  loginAttempts: {
    maxAttempts: 5,                 // 最大尝试次数
    lockDuration: 15 * 60 * 1000    // 锁定时长（15分钟）
  },

  // 会话配置
  session: {
    maxAge: 24 * 60 * 60 * 1000,    // 会话最大时长（24小时）
    renewThreshold: 30 * 60 * 1000   // 更新阈值（30分钟）
  },

  // 白名单路径（不需要认证的路径）
  whiteList: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/health'
  ]
}; 