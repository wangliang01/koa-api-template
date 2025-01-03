const requireDirectory = require('require-directory');
const path = require('path');
const Router = require('@koa/router');

/**
 * 自动注册路由插件
 * @param {Object} app - Koa 实例
 */
function registerRouters(app) {
    // 路由文件目录
    const routerDir = path.join(__dirname, '../routes');
    // 使用require-directory自动加载路由文件
    const modules = requireDirectory(module, routerDir, {
        visit: (router) => {
            if (router && router instanceof Router) {
                // 注册路由
                app.use(router.routes());
                app.use(router.allowedMethods());
            }
        }
    });

    console.log(`[Router] Total registered routes: ${Object.keys(modules).length}`);
}

module.exports = registerRouters;