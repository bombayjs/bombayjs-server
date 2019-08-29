import { Application } from 'egg';

module.exports = (app: Application) => {
    const apiV1Router = app.router.namespace('/api/v1');
    const { controller, middleware } = app;
    const { api } = controller;

    const tokenRequired = middleware.tokenRequired();

    // 应用列表
    apiV1Router.get('/admin', tokenRequired, api.index);
    apiV1Router.post('/register', api.register);
};
