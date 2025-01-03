/**
 * JWT工具类
 * 用于处理Token的生成和验证
 */

const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

class JwtUtil {
  /**
   * 生成Token
   * @param {Object} payload - Token载荷
   * @param {Object} options - 自定义选项
   * @returns {string} token
   */
  static generateToken(payload, options = {}) {
    const defaultOptions = {
      expiresIn: authConfig.jwt.expiresIn,
      issuer: authConfig.jwt.issuer,
      audience: authConfig.jwt.audience
    };

    return jwt.sign(
      payload,
      authConfig.jwt.secret,
      { ...defaultOptions, ...options }
    );
  }

  /**
   * 验证Token
   * @param {string} token - JWT Token
   * @returns {Object} 解码后的payload
   * @throws {Error} 验证失败时抛出错误
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, authConfig.jwt.secret, {
        issuer: authConfig.jwt.issuer,
        audience: authConfig.jwt.audience
      });
    } catch (error) {
      throw new Error('无效的Token');
    }
  }

  /**
   * 解码Token（不验证）
   * @param {string} token - JWT Token
   * @returns {Object} 解码后的payload
   */
  static decodeToken(token) {
    return jwt.decode(token);
  }

  /**
   * 从请求头中提取Token
   * @param {Object} ctx - Koa上下文
   * @returns {string|null} token
   */
  static getTokenFromHeader(ctx) {
    const authorization = ctx.headers.authorization;
    if (!authorization) return null;

    const parts = authorization.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

    return parts[1];
  }

  /**
   * 刷新Token
   * @param {string} oldToken - 旧Token
   * @returns {string} 新Token
   */
  static refreshToken(oldToken) {
    const payload = this.verifyToken(oldToken);
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti;
    
    return this.generateToken(payload);
  }
}

module.exports = JwtUtil; 