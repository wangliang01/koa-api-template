/**
 * 验证工具类
 * 用于处理输入验证
 */

const authConfig = require('../config/auth');

class Validator {
  /**
   * 验证邮箱格式
   * @param {string} email - 邮箱地址
   * @returns {boolean} 是否有效
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 验证密码强度
   * @param {string} password - 密码
   * @returns {Object} 验证结果
   */
  static validatePassword(password) {
    const { minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars } = authConfig.passwordPolicy;
    
    const result = {
      isValid: true,
      errors: []
    };

    if (password.length < minLength) {
      result.errors.push(`密码长度必须至少为${minLength}个字符`);
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
      result.errors.push('密码必须包含至少一个大写字母');
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
      result.errors.push('密码必须包含至少一个小写字母');
    }

    if (requireNumbers && !/\d/.test(password)) {
      result.errors.push('密码必须包含至少一个数字');
    }

    if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      result.errors.push('密码必须包含至少一个特殊字符');
    }

    result.isValid = result.errors.length === 0;
    return result;
  }

  /**
   * 验证手机号格式
   * @param {string} phone - 手机号
   * @returns {boolean} 是否有效
   */
  static isValidPhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  }

  /**
   * 验证用户名格式
   * @param {string} username - 用户名
   * @returns {boolean} 是否有效
   */
  static isValidUsername(username) {
    // 用户名长度4-20位，只能包含字母、数字、下划线
    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
    return usernameRegex.test(username);
  }

  /**
   * 验证URL格式
   * @param {string} url - URL地址
   * @returns {boolean} 是否有效
   */
  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 验证日期格式
   * @param {string} date - 日期字符串
   * @returns {boolean} 是否有效
   */
  static isValidDate(date) {
    const timestamp = Date.parse(date);
    return !isNaN(timestamp);
  }

  /**
   * 验证身份证号格式
   * @param {string} idCard - 身份证号
   * @returns {boolean} 是否有效
   */
  static isValidIdCard(idCard) {
    const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return idCardRegex.test(idCard);
  }

  /**
   * 验证是否为空
   * @param {any} value - 要验证的值
   * @returns {boolean} 是否为空
   */
  static isEmpty(value) {
    return value === undefined || value === null || value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0);
  }

  /**
   * 验证是否为数字
   * @param {any} value - 要验证的值
   * @returns {boolean} 是否为数字
   */
  static isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
}

module.exports = Validator; 