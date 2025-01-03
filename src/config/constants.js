/**
 * 系统常量配置文件
 */

// HTTP状态码
const HTTP_STATUS = {
  SUCCESS: 200,           // 成功
  CREATED: 201,          // 创建成功
  BAD_REQUEST: 400,      // 错误请求
  UNAUTHORIZED: 401,     // 未授权
  FORBIDDEN: 403,        // 禁止访问
  NOT_FOUND: 404,        // 未找到
  INTERNAL_ERROR: 500    // 服务器内部错误
};

// 用户角色
const USER_ROLES = {
  ADMIN: 'admin',        // 管理员
  USER: 'user',          // 普通用户
  GUEST: 'guest'         // 访客
};

// 密码加密配置
const PASSWORD_CONFIG = {
  SALT_ROUNDS: 10        // bcrypt加密轮数
};

// 分页配置
const PAGINATION = {
  DEFAULT_PAGE: 1,       // 默认页码
  DEFAULT_PAGE_SIZE: 10  // 默认每页条数
};

// 日志级别
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

// Token配置
const TOKEN_CONFIG = {
  TOKEN_TYPE: 'Bearer',          // Token类型
  TOKEN_HEADER: 'Authorization'  // Token请求头
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  PASSWORD_CONFIG,
  PAGINATION,
  LOG_LEVELS,
  TOKEN_CONFIG
}; 