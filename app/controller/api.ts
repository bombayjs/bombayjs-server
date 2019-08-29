import { Controller } from 'egg';

export default class ApiController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = await ctx.model.User.find({});
  }

  // 用户注册
  async register() {
    const { ctx } = this;
    const query = ctx.request.body;
    const userName = query.userName;
    const passWord = query.passWord;

    if (!userName) throw new Error('用户登录：userName不能为空');
    if (!passWord) throw new Error('用户登录：passWord不能为空');

    const result = await ctx.service.user.register(userName, passWord);

    result instanceof Object ?
    ctx.body = this.app.retResult({
        data: result,
    }) :
    ctx.body = this.app.retError(result);
  }

  // 用户登录
  async login() {
    const { ctx } = this;
    const query = ctx.request.body;
    const userName = query.userName;
    const passWord = query.passWord;

    if (!userName) throw new Error('用户登录：userName不能为空');
    if (!passWord) throw new Error('用户登录：passWord不能为空');

    const result = await ctx.service.user.login(userName, passWord);

    result instanceof Object ?
    ctx.body = this.app.retResult({
        data: result,
    }) :
    ctx.body = this.app.retError(result);
  }

  // 退出登录
  async logout() {
    const { ctx } = this;
    const usertoken = ctx.cookies.get('usertoken', {
        encrypt: true,
        signed: true,
    }) || '';
    if (!usertoken) throw new Error('退出登录：token不能为空');

    await ctx.service.user.logout(usertoken);
    this.ctx.body = this.app.retResult({
        data: {},
    });
  }

  // 冻结解冻用户
  async setIsUse() {
    const { ctx } = this;
    const query = ctx.request.body;
    const isUse = query.isUse || 0;
    const id = query.id || '';
    const usertoken = query.usertoken || '';

    if (!id) throw new Error('冻结解冻用户：id不能为空');

    const result = await ctx.service.user.setIsUse(id, isUse, usertoken);

    result instanceof Object ?
    ctx.body = this.app.retResult({
        data: result,
    }) :
    ctx.body = this.app.retError(result);
  }

  // 删除用户
  async delete() {
    const { ctx } = this;
    const query = ctx.request.body;
    const id = query.id || '';
    const usertoken = query.usertoken || '';

    if (!id) throw new Error('删除用户：id不能为空');

    const result = await ctx.service.user.delete(id, usertoken);

    result instanceof Object ?
      ctx.body = this.app.retResult({
          data: result,
      }) :
      ctx.body = this.app.retError(result);
  }
}
