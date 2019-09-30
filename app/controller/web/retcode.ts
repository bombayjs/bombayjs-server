import { Controller } from 'egg';

export default class RetcodeController extends Controller {
  constructor(ctx) {
    super(ctx);
  }
  // 数据处理
  public async list() {
    const { ctx, service: { web } } = this;
    // 组装参数
    const payload = ctx.request.body || {};
    let res = {};
    const { metric } = payload;
    // 界面统计
    if (metric === 'webstat.url') {
      res = await web.retcode.webstat(payload);
    } else {
      res = await web.retcode.list(payload);
    }
    ctx.helper.success(res);
  }

}
