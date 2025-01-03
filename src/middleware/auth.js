/**
 * 认证中间件
 * 用于处理用户认证和授权
 */

const JwtUtil = require('../utils/jwt');
const Response = require('../utils/response');
const Logger = require('../utils/logger');
const authConfig = require('../config/auth');

class AuthMiddleware {
  /**
   * 验证JWT Token
   * @param {Object} ctx - Koa上下文
   * @param {Function} next - 下一个中间件
   */
  static async verifyToken(ctx, next) {
    // 检查是否是白名单路径
    if (authConfig.whiteList.includes(ctx.path)) {
      return next();
    }

    const token = JwtUtil.getTokenFromHeader(ctx);
    if (!token) {
      return Response.unauthorized(ctx, '请先登录');
    }

    try {
      const decoded = JwtUtil.verifyToken(token);
      ctx.state.user = decoded;
      await next();
    } catch (error) {
      Logger.warn('Token验证失败', { error: error.message, path: ctx.path });
      Response.unauthorized(ctx, '登录已过期，请重新登录');
    }
  }

  /**
   * 检查用户角色
   * @param {string[]} roles - 允许的角色列表
   */
  static hasRole(roles) {
    return async (ctx, next) => {
      const { user } = ctx.state;
      if (!user) {
        return Response.unauthorized(ctx, '请先登录');
      }

      if (!roles.includes(user.role)) {
        Logger.warn('用户权限不足', {
          userId: user.id,
          requiredRoles: roles,
          userRole: user.role
        });
        return Response.forbidden(ctx, '权限不足');
      }

      await next();
    };
  }

  /**
   * 检查用户权限
   * @param {string[]} permissions - 允许的权限列表
   */
  static hasPermission(permissions) {
    return async (ctx, next) => {
      const { user } = ctx.state;
      if (!user) {
        return Response.unauthorized(ctx, '请先登录');
      }

      // 超级管理员拥有所有权限
      if (user.role === 'admin') {
        return next();
      }

      const hasPermission = user.permissions && 
        permissions.some(permission => user.permissions.includes(permission));

      if (!hasPermission) {
        Logger.warn('用户权限不足', {
          userId: user.id,
          requiredPermissions: permissions,
          userPermissions: user.permissions
        });
        return Response.forbidden(ctx, '权限不足');
      }

      await next();
    };
  }

  /**
   * 限制请求频率
   * @param {number} maxRequests - 最大请求次数
   * @param {number} windowMs - 时间窗口（毫秒）
   */
  static rateLimit(maxRequests, windowMs) {
    const requests = new Map();

    return async (ctx, next) => {
      const key = ctx.ip;
      const now = Date.now();
      const windowStart = now - windowMs;

      // 清理过期的请求记录
      requests.forEach((timestamps, ip) => {
        requests.set(ip, timestamps.filter(time => time > windowStart));
      });

      // 获取当前IP的请求记录
      const timestamps = requests.get(key) || [];
      timestamps.push(now);
      requests.set(key, timestamps);

      // 检查是否超过限制
      if (timestamps.length > maxRequests) {
        Logger.warn('请求频率超限', { ip: key, count: timestamps.length });
        return Response.error(ctx, '请求过于频繁，请稍后再试', 429);
      }

      await next();
    };
  }

  /**
   * 检查是否是活跃会话
   */
  static async checkActiveSession(ctx, next) {
    const { user } = ctx.state;
    if (!user) {
      return Response.unauthorized(ctx, '请先登录');
    }

    // 检查会话是否需要更新
    const tokenAge = Date.now() - user.iat * 1000;
    if (tokenAge > authConfig.session.renewThreshold) {
      // 生成新的token
      const newToken = JwtUtil.refreshToken(JwtUtil.getTokenFromHeader(ctx));
      ctx.set('New-Token', newToken);
    }

    await next();
  }
}

module.exports = AuthMiddleware; 