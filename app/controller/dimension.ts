import { Controller } from 'egg';

export default class EventVariateController extends Controller {
  async get() {
    const { ctx } = this;
    ctx.body = await ctx.service.dimension.get();
  }
}
