import { Application } from 'egg';

module.exports = (app: Application) => {
    const apiV1Router = app.router.namespace('/api/v1');
    const { controller, middleware } = app;
    const { api } = controller;

    const tokenRequired = middleware.tokenRequired();

    // 应用列表
    apiV1Router.get('/admin', tokenRequired, api.index);
    apiV1Router.post('/register', api.register);
    apiV1Router.post('/login', api.login);
    apiV1Router.post('/logout', api.logout);
    apiV1Router.post('/setIsUse', api.setIsUse);
    apiV1Router.post('/delete', api.delete);
};
