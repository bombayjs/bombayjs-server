import { Controller } from 'egg';

export default class ErrorController extends Controller {

  // error列表
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.service.web.error.list(ctx);
  }

    // error列表
  async filterList() {
    const { ctx } = this;
    ctx.body = await ctx.service.web.error.filterList(ctx);
  }
}
