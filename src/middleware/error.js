/**
 * 错误处理中间件
 * 用于统一处理应用错误
 */

const Response = require('../utils/response');
const Logger = require('../utils/logger');
const { HTTP_STATUS } = require('../config/constants');

class ErrorMiddleware {
  /**
   * 全局错误处理中间件
   * @param {Object} ctx - Koa上下文
   * @param {Function} next - 下一个中间件
   */
  static async handleError(ctx, next) {
    try {
      await next();
    } catch (error) {
      // 记录错误日志
      Logger.error('应用错误', error);

      // 处理不同类型的错误
      if (error.name === 'ValidationError') {
        // 验证错误
        return Response.badRequest(ctx, error.message);
      }

      if (error.name === 'SequelizeValidationError') {
        // Sequelize验证错误
        const messages = error.errors.map(err => err.message);
        return Response.badRequest(ctx, messages.join('; '));
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        // 唯一约束错误
        return Response.badRequest(ctx, '数据已存在');
      }

      if (error.name === 'SequelizeForeignKeyConstraintError') {
        // 外键约束错误
        return Response.badRequest(ctx, '关联数据不存在');
      }

      if (error.name === 'SequelizeDatabaseError') {
        // 数据库错误
        return Response.error(ctx, '数据库操作失败', HTTP_STATUS.INTERNAL_ERROR);
      }

      // 根据错误状态码返回对应的错误响应
      const status = error.status || HTTP_STATUS.INTERNAL_ERROR;
      const message = error.message || '服务器内部错误';

      if (status === HTTP_STATUS.NOT_FOUND) {
        return Response.notFound(ctx, message);
      }

      if (status === HTTP_STATUS.UNAUTHORIZED) {
        return Response.unauthorized(ctx, message);
      }

      if (status === HTTP_STATUS.FORBIDDEN) {
        return Response.forbidden(ctx, message);
      }

      if (status === HTTP_STATUS.BAD_REQUEST) {
        return Response.badRequest(ctx, message);
      }

      // 默认返回500错误
      Response.error(ctx, message, status);
    }
  }

  /**
   * 404错误处理中间件
   * @param {Object} ctx - Koa上下文
   */
  static async handle404(ctx) {
    if (ctx.status === 404) {
      Response.notFound(ctx, '请求的资源不存在');
    }
  }

  /**
   * 请求超时处理中间件
   * @param {number} timeout - 超时时间（毫秒）
   */
  static async handleTimeout(timeout = 30000) {
    return async (ctx, next) => {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('请求超时'));
        }, timeout);
      });

      try {
        await Promise.race([next(), timeoutPromise]);
      } catch (error) {
        if (error.message === '请求超时') {
          Logger.warn('请求超时', {
            path: ctx.path,
            method: ctx.method,
            timeout
          });
          Response.error(ctx, '请求超时', 504);
        } else {
          throw error;
        }
      }
    };
  }

  /**
   * 业务异常处理
   * @param {Error} error - 错误对象
   * @param {string} message - 错误消息
   * @param {number} status - HTTP状态码
   */
  static businessError(message, status = HTTP_STATUS.BAD_REQUEST) {
    const error = new Error(message);
    error.status = status;
    return error;
  }
}

module.exports = ErrorMiddleware; 