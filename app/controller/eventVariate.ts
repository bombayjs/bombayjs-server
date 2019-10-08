import { Controller } from 'egg';

export default class EventVariateController extends Controller {
  async add() {
    const { ctx } = this;
    ctx.body = await ctx.service.eventVariate.add(ctx);
  }

}
