import { Application } from 'egg';

module.exports = (app: Application) => {
    const { router, controller } = app;
    const { home } = controller;
    // 应用列表
    router.get('/web', home.index);

};
