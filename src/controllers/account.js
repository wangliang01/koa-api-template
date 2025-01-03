const Account = require('../models/account');
const { Op } = require('sequelize');
const { validateEmail } = require('../utils/validator');
const Response = require('../utils/response');
const bcrypt = require('bcryptjs');

class AccountController {
    // 创建账号
    static async create(ctx) {
        const { email, password, name, statusId = 1 } = ctx.request.body;
        const createdBy = ctx.state.user.email;

        try {
            // 参数验证
            if (!email || !validateEmail(email)) {
                return Response.badRequest(ctx, '邮箱格式不正确');
            }
            if (!password || password.length < 6) {
                return Response.badRequest(ctx, '密码长度不能小于6位');
            }
            if (!name || name.length < 2 || name.length > 50) {
                return Response.badRequest(ctx, '用户名长度必须在2-50个字符之间');
            }

            // 检查邮箱是否已存在
            const existingAccount = await Account.findOne({
                where: { Email: email }
            });

            if (existingAccount) {
                return Response.badRequest(ctx, '邮箱已存在');
            }

            // 密码加密
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 创建账号
            const account = await Account.create({
                Email: email,
                Password: hashedPassword,
                Name: name,
                StatusId: statusId,
                CreatedBy: createdBy
            });

            // 移除密码字段
            const accountData = account.toJSON();
            delete accountData.Password;

            Response.created(ctx, accountData);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return Response.badRequest(ctx, '邮箱已存在');
            }
            throw error;
        }
    }

    // 获取账号列表
    static async getList(ctx) {
        const { page = 1, pageSize = 10, statusId, keyword } = ctx.query;
        const offset = (parseInt(page) - 1) * parseInt(pageSize);
        const where = {};

        // 构建查询条件
        if (statusId !== undefined) {
            where.StatusId = parseInt(statusId);
        }

        if (keyword) {
            where[Op.or] = [
                { Email: { [Op.like]: `%${keyword}%` } },
                { Name: { [Op.like]: `%${keyword}%` } }
            ];
        }

        // 查询数据
        const { count, rows } = await Account.findAndCountAll({
            where,
            offset,
            limit: parseInt(pageSize),
            order: [['CreatedDateTime', 'DESC']]
        });

        Response.page(ctx, {
            list: rows,
            total: count,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        });
    }

    // 获取账号详情
    static async getDetail(ctx) {
        const { id } = ctx.params;
        
        const account = await Account.findByPk(id);
        if (!account) {
            return Response.notFound(ctx, '账号不存在');
        }

        Response.success(ctx, account);
    }

    // 更新账号
    static async update(ctx) {
        const { id } = ctx.params;
        const { name, statusId } = ctx.request.body;
        const updatedBy = ctx.state.user.email;

        // 检查账号是否存在
        const account = await Account.findByPk(id);
        if (!account) {
            return Response.notFound(ctx, '账号不存在');
        }

        // 参数验证
        if (name && (name.length < 2 || name.length > 50)) {
            return Response.badRequest(ctx, '用户名长度必须在2-50个字符之间');
        }

        // 构建更新数据
        const updateData = {
            UpdatedBy: updatedBy
        };

        if (name !== undefined) {
            updateData.Name = name;
        }
        if (statusId !== undefined) {
            updateData.StatusId = parseInt(statusId);
        }

        // 更新账号
        await account.update(updateData);

        const updatedAccount = await Account.findByPk(id);
        Response.success(ctx, updatedAccount);
    }

    // 删除账号
    static async delete(ctx) {
        const { id } = ctx.params;
        
        const account = await Account.findByPk(id);
        if (!account) {
            return Response.notFound(ctx, '账号不存在');
        }

        await account.destroy();

        Response.success(ctx, null, '删除成功');
    }

    // 更新最后登录时间
    static async updateLastLogin(ctx) {
        const { id } = ctx.params;
        
        const account = await Account.findByPk(id);
        if (!account) {
            return Response.notFound(ctx, '账号不存在');
        }

        await account.update({
            LastLoginDateTime: new Date()
        });

        Response.success(ctx, null, '更新成功');
    }


}

module.exports = AccountController; 