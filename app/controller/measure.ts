import { Controller } from 'egg';

export default class EventVariateController extends Controller {
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.service.measure.list();
  }
}
