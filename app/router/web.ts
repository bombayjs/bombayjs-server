import { Application } from 'egg';

module.exports = (app: Application) => {
  const apiV1Router = app.router.namespace('/api/v1');
  const { controller, middleware } = app;
  const { index, report } = controller.web;

  const tokenRequired = middleware.tokenRequired();
  apiV1Router.get('/web', tokenRequired, index.index);
  // 浏览器用户数据上报
  apiV1Router.get('/report/web', report.webReport);
};
