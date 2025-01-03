const { koaBody } = require("koa-body");

const registerBody = (app) => {
  // 请求体解析中间件
  app.use(
    koaBody({
      multipart: true,
      formidable: {
        maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小限制为 200MB
      },
      jsonLimit: "10mb",
      formLimit: "10mb",
      textLimit: "10mb",
    })
  );
};

module.exports = registerBody;
