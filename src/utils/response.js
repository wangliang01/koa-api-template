/**
 * 响应处理工具
 * 用于统一处理API响应格式
 */

const { HTTP_STATUS } = require('../config/constants');

class Response {
  /**
   * 成功响应
   * @param {Object} ctx - Koa上下文
   * @param {any} data - 响应数据
   * @param {string} message - 响应消息
   * @param {number} status - HTTP状态码
   */
  static success(ctx, data = null, message = '操作成功', status = HTTP_STATUS.SUCCESS) {
    ctx.status = status;
    ctx.body = {
      success: true,
      code: status,
      message,
      data
    };
  }

  /**
   * 错误响应
   * @param {Object} ctx - Koa上下文
   * @param {string} message - 错误消息
   * @param {number} status - HTTP状态码
   * @param {any} error - 错误详情
   */
  static error(ctx, message = '操作失败', status = HTTP_STATUS.INTERNAL_ERROR, error = null) {
    ctx.status = status;
    ctx.body = {
      success: false,
      code: status,
      message,
      error: error ? (error.message || error) : null
    };
  }

  /**
   * 分页响应
   * @param {Object} ctx - Koa上下文
   * @param {Array} list - 数据列表
   * @param {number} total - 总记录数
   * @param {number} page - 当前页码
   * @param {number} pageSize - 每页记录数
   */
  static page(ctx, { list, total, page, pageSize }) {
    ctx.status = HTTP_STATUS.SUCCESS;
    ctx.body = {
      success: true,
      code: HTTP_STATUS.SUCCESS,
      message: '查询成功',
      data: {
        list,
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    };
  }

  /**
   * 创建成功响应
   * @param {Object} ctx - Koa上下文
   * @param {any} data - 创建的数据
   * @param {string} message - 响应消息
   */
  static created(ctx, data = null, message = '创建成功') {
    this.success(ctx, data, message, HTTP_STATUS.CREATED);
  }

  /**
   * 未授权响应
   * @param {Object} ctx - Koa上下文
   * @param {string} message - 错误消息
   */
  static unauthorized(ctx, message = '未授权') {
    this.error(ctx, message, HTTP_STATUS.UNAUTHORIZED);
  }

  /**
   * 禁止访问响应
   * @param {Object} ctx - Koa上下文
   * @param {string} message - 错误消息
   */
  static forbidden(ctx, message = '禁止访问') {
    this.error(ctx, message, HTTP_STATUS.FORBIDDEN);
  }

  /**
   * 资源未找到响应
   * @param {Object} ctx - Koa上下文
   * @param {string} message - 错误消息
   */
  static notFound(ctx, message = '资源未找到') {
    this.error(ctx, message, HTTP_STATUS.NOT_FOUND);
  }

  /**
   * 参数错误响应
   * @param {Object} ctx - Koa上下文
   * @param {string} message - 错误消息
   */
  static badRequest(ctx, message = '参数错误') {
    this.error(ctx, message, HTTP_STATUS.BAD_REQUEST);
  }
}

module.exports = Response; 