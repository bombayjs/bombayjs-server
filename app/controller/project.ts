import { Controller } from 'egg';

export default class ProjectController extends Controller {
  // 新增系统
  async addNewProject() {
    const { ctx } = this;
    ctx.body = await ctx.service.project.saveProjectData(ctx);
  }

  // 修改系统信息
  async updateProject() {
    const { ctx } = this;
    return await ctx.service.project.updateProjectData(ctx);
  }

  // 根据用户id获取系统列表
  async getProjectsForUserId() {
    const { ctx } = this;
    ctx.body = await ctx.service.project.getProjectsForUserId(ctx);
  }

  // 根据系统ID获得单个系统信息
  async getProjectsForId() {
    const { ctx } = this;
    const query = ctx.request.query;
    const appId = query.appId;
    ctx.body = await ctx.service.project.getProjectForDb(appId);
  }

  // 系统列表
  async getWebProjectList() {
    const { ctx } = this;
    ctx.body = await ctx.service.project.getWebProjectList();
  }

  // 删除系统中某个用户
  async deleteWebProjectUser() {
    const { ctx } = this;
    ctx.body = await ctx.service.project.deleteWebProjectUser(ctx);
  }

  // 系统中新增某个用户
  async addWebProjectUser() {
    const { ctx } = this;
    ctx.body = await ctx.service.project.addWebProjectUser(ctx);
  }

  // 删除某个系统
  async deleteProject() {
    const { ctx } = this;
    ctx.body = await ctx.service.project.deleteProject(ctx);
  }

  // 新增 | 删除 日报邮件
  async handleDaliyEmail() {
    const { ctx } = this;
    const query = ctx.request.body;
    const appId = query.appId;
    const email = query.email;
    const type = query.type || 1;
    const item = query.item || 1;
    ctx.body = await ctx.service.project.handleDaliyEmail(appId, email, type, true, item);
  }
}
