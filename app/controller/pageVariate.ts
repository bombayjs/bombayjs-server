import { Controller } from 'egg';

export default class PageVariateController extends Controller {
  async get() {
    const { ctx } = this;
    ctx.body = await ctx.service.pageVariate.get();
  }

  async set() {
    const { ctx } = this;
    ctx.body = await ctx.service.pageVariate.set();
  }

  async list() {
    const { ctx } = this;
    ctx.body = await ctx.service.pageVariate.list();
  }

}
