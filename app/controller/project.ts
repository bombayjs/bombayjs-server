import { Controller } from 'egg';

export default class ProjectController extends Controller {
  // 新增系统
  async addNewSystem() {
    const { ctx } = this;
    ctx.body = await ctx.service.project.saveSystemData(ctx);
  }

  // 修改系统信息
  async updateSystem() {
    const { ctx } = this;
    return await ctx.service.project.updateSystemData(ctx);
  }

  // 根据用户id获取系统列表
  async getSysForUserId() {
    const { ctx } = this;
    ctx.body = await ctx.service.project.getSysForUserId(ctx);
  }

  // 根据系统ID获得单个系统信息
  async getSystemForId() {
    const { ctx } = this;
    const query = ctx.request.query;
    const appId = query.appId;
    ctx.body = await ctx.service.project.getSystemForDb(appId);
  }

  // 系统列表
  async getWebSystemList() {
    const { ctx } = this;
    ctx.body = await ctx.service.project.getWebSystemList();
  }

  // 删除系统中某个用户
  async deleteWebSystemUser() {
    const { ctx } = this;
    ctx.body = await ctx.service.project.deleteWebSystemUser(ctx);
  }

  // 系统中新增某个用户
  async addWebSystemUser() {
    const { ctx } = this;
    ctx.body = await ctx.service.project.addWebSystemUser(ctx);
  }

  // 删除某个系统
  async deleteSystem() {
    const { ctx } = this;
    ctx.body = await ctx.service.project.deleteSystem(ctx);
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
