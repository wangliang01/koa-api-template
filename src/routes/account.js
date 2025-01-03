const Router = require('@koa/router');
const AccountController = require('../controllers/account');
const { verifyToken } = require('../middleware/auth');

const router = new Router({
    prefix: '/api/v1/account'
});

// 创建账号
router.post('/', verifyToken, AccountController.create);

// 获取账号列表
router.get('/', verifyToken, AccountController.getList);

// 获取账号详情
router.get('/:id', verifyToken, AccountController.getDetail);

// 更新账号
router.put('/:id', verifyToken, AccountController.update);

// 删除账号
router.delete('/:id', verifyToken, AccountController.delete);


module.exports = router; 