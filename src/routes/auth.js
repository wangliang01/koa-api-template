const Router = require('@koa/router');
const AuthController = require('../controllers/auth');

const router = new Router({
    prefix: '/api/v1/auth'
});

// 注册
router.post('/register', AuthController.register);

// 登录
router.post('/login', AuthController.login);

module.exports = router; 