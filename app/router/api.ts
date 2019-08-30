import { Application } from 'egg';

module.exports = (app: Application) => {
    const apiV1Router = app.router.namespace('/api/v1');
    const { controller, middleware } = app;
    const { user, project } = controller;

    const tokenRequired = middleware.tokenRequired();

    // 用户
    apiV1Router.get('/user/admin', tokenRequired, user.index);
    apiV1Router.post('/user/register', user.register);
    apiV1Router.post('/user/login', user.login);
    apiV1Router.post('/user/logout', tokenRequired, user.logout);
    apiV1Router.post('/user/setIsUse', tokenRequired, user.setIsUse);
    apiV1Router.post('/user/delete', tokenRequired, user.delete);

    // ----------------应用配置相关---------------
    // 新增应用
    apiV1Router.post('/project/add', tokenRequired, project.addNewSystem);
    // 修改应用
    apiV1Router.post('/project/update', tokenRequired, project.updateSystem);
    // 根据用户ID获得应用信息
    apiV1Router.get('/project/getSysForUserId', tokenRequired, project.getSysForUserId);
    // 根据应用ID获得单个应用信息
    apiV1Router.get('/project/getSystemForId', tokenRequired, project.getSystemForId);
    // 获得应用列表
    apiV1Router.get('/project/web/list', tokenRequired, project.getWebSystemList);
    // 删除应用中某个用户
    apiV1Router.post('/project/deleteUser', tokenRequired, project.deleteWebSystemUser);
    // 新增应用中某个用户
    apiV1Router.post('/project/addUser', tokenRequired, project.addWebSystemUser);
    // 删除某个应用
    apiV1Router.post('/project/delete', tokenRequired, project.deleteSystem);
    // 日报邮件操作
    apiV1Router.post('/project/handleDaliyEmail', tokenRequired, project.handleDaliyEmail);
};
