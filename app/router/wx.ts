import { Application } from 'egg';

module.exports = (app: Application) => {
    const { router, controller } = app;
    const { index } = controller.wx;
    // 应用列表
    router.get('/wx', index.index);

};
