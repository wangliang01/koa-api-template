const Account = require('../models/account');
const Response = require('../utils/response');
const bcrypt = require('bcryptjs');
const JwtUtil = require('../utils/jwt');

class AuthController {
    // 注册
    static async register(ctx) {
        const { email, password, name } = ctx.request.body;
        
        try {
            // 密码加密
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 创建账号
            const account = await Account.create({
                Email: email,
                Password: hashedPassword,
                Name: name,
                StatusId: 1,
                CreatedBy: 'system'
            });

            // 移除密码字段
            const accountData = account.toJSON();
            delete accountData.Password;

            Response.success(ctx, accountData);
        } catch (error) {
            Response.error(ctx, '注册失败', 500, error);
        }
    }
  
    // 登录
    static async login(ctx) {
        const { email, password } = ctx.request.body;

        // 参数验证
        if (!email || !password) {
            return Response.badRequest(ctx, '邮箱和密码不能为空');
        }

        try {
            // 查找用户
            const account = await Account.findOne({
                where: { Email: email }
            });

            if (!account) {
                return Response.unauthorized(ctx, '账号或密码错误');
            }

            // 验证密码
            const isMatch = await bcrypt.compare(password, account.Password);
            if (!isMatch) {
                return Response.unauthorized(ctx, '账号或密码错误');
            }

            // 检查账号状态
            if (account.StatusId === 0) {
                return Response.forbidden(ctx, '账号已被禁用');
            }

            // 生成 token
            const token = JwtUtil.generateToken({
                id: account.Id,
                email: account.Email,
                name: account.Name
            });

            // 更新最后登录时间
            await account.update({
                LastLoginDateTime: new Date()
            });

            // 移除密码字段
            const accountData = account.toJSON();
            delete accountData.Password;

            Response.success(ctx, {
                token,
                account: accountData
            });
        } catch (error) {
            Response.error(ctx, '登录失败', 500, error);
        }
    }
}

module.exports = AuthController; 