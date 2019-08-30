import { Controller } from 'egg';

export default class UserController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = await ctx.model.User.find({});
  }

  // 用户注册
  async register() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.register(ctx);
  }

  // 用户登录
  async login() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.login(ctx);
  }

  // 退出登录
  async logout() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.logout(ctx);
  }

  // 冻结解冻用户
  async setIsUse() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.setIsUse(ctx);
  }

  // 删除用户
  async delete() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.delete(ctx);
  }
}
