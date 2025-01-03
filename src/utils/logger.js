/**
 * 日志工具类
 * 使用winston处理系统日志
 */

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
require('dotenv').config();

// 日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// 创建日志目录
const LOG_DIR = process.env.LOG_DIR || 'logs';

// 访问日志传输器
const accessTransport = new DailyRotateFile({
  filename: path.join(LOG_DIR, 'access-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info'
});

// 错误日志传输器
const errorTransport = new DailyRotateFile({
  filename: path.join(LOG_DIR, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error'
});

// 创建logger实例
const logger = winston.createLogger({
  format: logFormat,
  transports: [
    accessTransport,
    errorTransport,
    // 开发环境下在控制台输出日志
    ...(process.env.NODE_ENV !== 'production'
      ? [new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })]
      : [])
  ]
});

class Logger {
  /**
   * 记录信息日志
   * @param {string} message - 日志消息
   * @param {Object} meta - 元数据
   */
  static info(message, meta = {}) {
    logger.info(message, meta);
  }

  /**
   * 记录警告日志
   * @param {string} message - 日志消息
   * @param {Object} meta - 元数据
   */
  static warn(message, meta = {}) {
    logger.warn(message, meta);
  }

  /**
   * 记录错误日志
   * @param {string} message - 日志消息
   * @param {Error|Object} error - 错误对象或元数据
   */
  static error(message, error = {}) {
    logger.error(message, {
      error: error instanceof Error ? error.stack : error
    });
  }

  /**
   * 记录调试日志
   * @param {string} message - 日志消息
   * @param {Object} meta - 元数据
   */
  static debug(message, meta = {}) {
    logger.debug(message, meta);
  }

  /**
   * 记录HTTP请求日志
   * @param {Object} ctx - Koa上下文
   * @param {number} ms - 请求处理时间（毫秒）
   */
  static logRequest(ctx, ms) {
    const { method, url, status } = ctx;
    logger.info('HTTP Request', {
      method,
      url,
      status,
      duration: ms,
      ip: ctx.ip,
      userAgent: ctx.headers['user-agent']
    });
  }

  /**
   * 记录API错误日志
   * @param {Object} ctx - Koa上下文
   * @param {Error} error - 错误对象
   */
  static logApiError(ctx, error) {
    const { method, url, status } = ctx;
    logger.error('API Error', {
      method,
      url,
      status,
      error: error.stack,
      body: ctx.request.body,
      params: ctx.params,
      query: ctx.query
    });
  }
}

module.exports = Logger; 