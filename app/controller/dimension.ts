import { Controller } from 'egg';

export default class EventVariateController extends Controller {
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.service.dimension.list();
  }

  // 获取维度的值
  async get() {
    const { ctx } = this;
    ctx.body = await ctx.service.dimension.get();
  }
}
