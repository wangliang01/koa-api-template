/**
 * 日志中间件
 * 用于记录请求和响应日志
 */

const Logger = require('../utils/logger');

class LogMiddleware {
  /**
   * 请求日志中间件
   * @param {Object} ctx - Koa上下文
   * @param {Function} next - 下一个中间件
   */
  static async logRequest(ctx, next) {
    const start = Date.now();
    const requestId = Math.random().toString(36).substring(7);

    // 记录请求信息
    Logger.info('收到请求', {
      requestId,
      method: ctx.method,
      url: ctx.url,
      query: ctx.query,
      body: ctx.request.body,
      headers: {
        'user-agent': ctx.headers['user-agent'],
        'content-type': ctx.headers['content-type'],
        'x-forwarded-for': ctx.headers['x-forwarded-for'] || ctx.ip
      }
    });

    try {
      // 调用下一个中间件
      await next();

      // 计算响应时间
      const ms = Date.now() - start;

      // 记录响应信息
      Logger.info('请求处理完成', {
        requestId,
        status: ctx.status,
        duration: ms,
        responseHeaders: {
          'content-type': ctx.response.headers['content-type'],
          'content-length': ctx.response.headers['content-length']
        }
      });
    } catch (error) {
      // 计算响应时间
      const ms = Date.now() - start;

      // 记录错误信息
      Logger.error('请求处理失败', {
        requestId,
        error: error.stack,
        duration: ms
      });

      throw error;
    }
  }

  /**
   * 慢请求日志中间件
   * @param {number} threshold - 慢请求阈值（毫秒）
   */
  static logSlowRequests(threshold = 1000) {
    return async (ctx, next) => {
      const start = Date.now();
      await next();
      const ms = Date.now() - start;

      if (ms > threshold) {
        Logger.warn('检测到慢请求', {
          method: ctx.method,
          url: ctx.url,
          duration: ms,
          threshold
        });
      }
    };
  }

  /**
   * 访问日志中间件
   * 记录用户访问信息
   */
  static async logAccess(ctx, next) {
    const user = ctx.state.user;
    const accessInfo = {
      timestamp: new Date().toISOString(),
      ip: ctx.ip,
      method: ctx.method,
      url: ctx.url,
      userAgent: ctx.headers['user-agent'],
      userId: user ? user.id : null,
      username: user ? user.username : 'anonymous'
    };

    Logger.info('用户访问', accessInfo);
    await next();
  }

  /**
   * 错误日志中间件
   * 记录详细的错误信息
   */
  static async logError(ctx, next) {
    try {
      await next();
    } catch (error) {
      const errorInfo = {
        timestamp: new Date().toISOString(),
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        request: {
          method: ctx.method,
          url: ctx.url,
          headers: ctx.headers,
          body: ctx.request.body,
          query: ctx.query
        },
        user: ctx.state.user
      };

      Logger.error('应用错误', errorInfo);
      throw error;
    }
  }

  /**
   * 数据库操作日志中间件
   */
  static logDatabase(operation, model, data) {
    Logger.info('数据库操作', {
      operation,
      model,
      data,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = LogMiddleware; 