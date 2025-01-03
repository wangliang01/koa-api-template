const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Account 模型定义
class Account extends Model {}

Account.init({
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: '账号ID'
    },
    Email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: '邮箱地址'
    },
    Password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '密码'
    },
    Name: {
        type: DataTypes.STRING(250),
        allowNull: false,
        comment: '用户名'
    },
    StatusId: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '状态：0-禁用，1-启用'
    },
    CreatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '创建人'
    },
    LastLoginDateTime: {
        type: DataTypes.DATE(3),
        defaultValue: '1000-01-01 00:00:00.000',
        comment: '最后登录时间'
    },
    CreatedDateTime: {
        type: DataTypes.DATE(3),
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
        comment: '创建时间'
    },
    UpdatedBy: {
        type: DataTypes.STRING(100),
        comment: '更新人'
    },
    UpdatedDateTime: {
        type: DataTypes.DATE(3),
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
        comment: '更新时间'
    }
}, {
    sequelize,
    modelName: 'Account',
    tableName: 'Account',
    timestamps: false
});

module.exports = Account;