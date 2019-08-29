import { Application } from 'egg';

module.exports = (app: Application) => {
    const { router, controller } = app;
    const { index } = controller.web;
    // 应用列表
    router.get('/web', index.index);

};
