import { Controller } from 'egg';

export default class HomeController extends Controller {
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

    result.success ?
    ctx.body = this.app.retResult({
        data: result,
    }) :
    ctx.body = this.app.retError(result)
  }
}
