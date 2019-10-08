import { Service } from 'egg';

export default class ProjectService extends Service {
  ProjectValidate: any;

  constructor(props) {
    super(props);
    this.ProjectValidate = {
      type: { type: 'string', required: true, trim: true, desc: '新增项目信息操作：请选择类型' },
      project_name: { type: 'string', required: true, trim: true, desc: '新增项目信息操作：项目名称不能为空' },
    };
  }
  // 保存用户上报的数据
  async saveProjectData(ctx) {
    const query = ctx.request.body;
    const type = query.type;
    // 参数校验
    ctx.validate(this.ProjectValidate);
    if (ctx.paramErrors) {
      // get error infos from `ctx.paramErrors`;
      return this.app.retError(ctx.paramErrors[0].desc);
    }
    if (!query.app_id && type === 'wx') return this.app.retError('新增项目信息操作：appId不能为空');
    if (!query.url && type === 'web') return this.app.retError('新增项目信息操作：url不能为空');

    // 检验项目是否存在
    const search = await ctx.model.Project.findOne({ project_name: query.project_name, type: query.type }).exec();
    if (search) return this.app.retError('新增项目信息操作：项目已存在');

    // 存储数据
    const token = this.app.randomString();

    const project = ctx.model.Project();
    project.project_name = query.project_name;
    project.token = token;
    project.url = query.url;
    project.type = query.type;
    project.app_id = query.app_id;
    project.user_id = [ ctx.currentUserId || '' ];
    project.is_use = query.is_use || 1;
    project.slow_page_time = query.slow_page_time || 5;
    project.slow_js_time = query.slow_js_time || 2;
    project.slow_css_time = query.slow_css_time || 2;
    project.slow_img_time = query.slow_img_time || 2;
    project.slow_ajax_time = query.slow_ajax_time || 2;
    project.is_statisi_pages = query.is_statisi_pages;
    project.is_statisi_ajax = query.is_statisi_ajax;
    project.is_statisi_resource = query.is_statisi_resource;
    project.is_statisi_system = query.is_statisi_system;
    project.is_statisi_error = query.is_statisi_error;

    const result = await project.save();
    // 存储到redis
    this._updateProjectCache(token);
    return this.app.retResult(result);
  }

  // 保存用户上报的数据
  async updateProjectData(ctx) {
    const query = ctx.request.body;
    const appId = query.app_id;
    // 参数校验
    if (!appId) return this.app.retError('更新项目信息操作：app_id不能为空');

    const update = { $set: {
        is_use: query.is_use || 0,
        project_name: query.project_name || '',
        slow_page_time: query.slow_page_time || 5,
        slow_js_time: query.slow_js_time || 2,
        type: query.type || 'web',
        slow_css_time: query.slow_css_time || 2,
        slow_img_time: query.slow_img_time || 2,
        slow_ajax_time: query.slow_ajax_time || 2,
        is_statisi_pages: query.is_statisi_pages || 0,
        is_statisi_ajax: query.is_statisi_ajax || 0,
        is_statisi_resource: query.is_statisi_resource || 0,
        is_statisi_system: query.is_statisi_system || 0,
        is_statisi_error: query.is_statisi_error || 0,
        is_daily_use: query.is_daily_use || 0,
    } };
    const result = await this.ctx.model.Project.update(
        { app_id: appId },
        update,
        { multi: true },
    ).exec();
    // 更新redis缓存
    this._updateProjectCache(appId);
    return this.app.retResult(result);
  }

  // 根据用户id获取项目列表
  async getProjectsForUserId(ctx) {
    const token = ctx.request.query.token;
    if (!token) return [];
    const result = await ctx.model.Project.where('user_id').elemMatch({ $eq: token }).exec() || [];
    return this.app.retResult(result);
  }

  // 获得某个项目信息(数据库)
  async getProjectForDb(appId) {
    if (!appId) return this.app.retError('查询某个项目信息：appId不能为空');
    const result = await this.ctx.model.Project.findOne({ app_id: appId }).exec() || {};
    return this.app.retResult(result);
  }

  // 获得项目列表信息
  async getWebProjectList() {
    const result = await this.ctx.model.Project.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: 'token',
          as: 'userlist',
        },
      },
    ]).exec();
    return this.app.retResult(result);
  }

  // 删除项目中某个用户
  async deleteWebProjectUser(ctx) {
    const query = ctx.request.body;
    const appId = query.appId;
    const userToken = query.userToken;

    if (!appId) return this.app.retError('删除系统中某个用户：appId不能为空');
    if (!userToken) return this.app.retError('删除系统中某个用户：userToken不能为空');

    const result = await this.ctx.model.Project.update(
      { app_id: appId },
      { $pull: { user_id: userToken } },
      { multi: true }).exec();
    return this.app.retResult(result);
  }

  // 项目中新增某个用户
  async addWebProjectUser(ctx) {
    const query = ctx.request.body;
    const appId = query.appId;
    const userToken = query.userToken;

    if (!appId) return this.app.retError('删除系统中某个用户：appId不能为空');
    if (!userToken) return this.app.retError('删除系统中某个用户：userToken不能为空');
    const result = await this.ctx.model.Project.update(
          { app_id: appId },
          { $addToSet: { user_id: userToken } },
          { multi: true }).exec();
    return this.app.retResult(result);
  }

  // 删除某个项目
  async deleteProject(ctx) {
    const query = ctx.request.body;
    const appId = query.appId;
    if (!appId) return this.app.retError('删除某个系统：appId不能为空');

    const result = await this.ctx.model.Project.findOneAndDelete({ app_id: appId }).exec();
    this.app.redis.set(appId, '', 'EX', 200);
    // setTimeout(async () => {
    //   const mongoose: any = this.app.mongooseDB;
    //   try { await mongoose.dropCollection(`web_pages_${appId}`); } catch (err) { console.log(err); }
    //   try { await mongoose.dropCollection(`web_ajaxs_${appId}`); } catch (err) { console.log(err); }
    //   try { await mongoose.dropCollection(`web_errors_${appId}`); } catch (err) { console.log(err); }
    //   try { await mongoose.dropCollection(`web_resources_${appId}`); } catch (err) { console.log(err); }
    //   try { await mongoose.dropCollection(`web_environment_${appId}`); } catch (err) { console.log(err); }
    // }, 500);
    return this.app.retResult(result);
  }

  // 新增 | 删除 日报邮件
  // item: 1:日报邮件发送  2：流量峰值邮件发送
  async handleDaliyEmail(appId, email, type, handleEmali = true, item = 1) {
    if (!appId) return this.app.retError('appId不能为空');
    type = type * 1;
    item = item * 1;
    let handleData: any = null;
    if (item === 1) {
        handleData = type === 1 ? { $addToSet: { daliy_list: email } } : { $pull: { daliy_list: email } };
    } else if (item === 2) {
        handleData = type === 1 ? { $addToSet: { highest_list: email } } : { $pull: { highest_list: email } };
    }
    const result = await this.ctx.model.Project.update(
        { app_id: appId },
        handleData,
        { multi: true }).exec();

    // 更新redis缓存
    this._updateProjectCache(appId);

    // 更新邮件相关信息
    if (handleEmali) this.updateEmailSystemIds(email, appId, type, item);

    return this.app.retResult(result);
  }

  // 更新邮件信息
  async updateEmailSystemIds(email, appId, handletype = 1, handleitem = 1) {
      if (!email) return;
      await this.ctx.service.emails.updateProjectIds({
          email,
          appId,
          handletype,
          handleitem,
      });
  }

  // 更新redis缓存
  async _updateProjectCache(token) {
    if (!token) throw new Error('查询某个项目信息：token不能为空');
    const project = await this.ctx.model.Project.findOne({ token }).exec() || {};
    await this.app.redis.set(token, JSON.stringify(project));
  }
  // 获得某个项目信息
  async getProjectForToken(token) {
      if (!token) throw new Error('查询某个项目信息：token不能为空');
      let result = await this.app.redis.get(token) || '{}';
      if (result === '{}') result = await this.ctx.model.Project.findOne({ token }).exec() || '{}';
      if (result === '{}') return JSON.parse(result);
      return result;
  }
  async getProjectByToken(token) {
    const result: string = await this.app.redis.get(token) || '{}';
    if (result === '{}') {
      return await this.ctx.model.Project.findOne({ token }).exec();
    } else {
      return JSON.parse(result);
    }
  }
}
