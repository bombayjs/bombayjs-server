import { Controller } from 'egg';

export default class RetcodeController extends Controller {
  constructor(ctx) {
    super(ctx);
  }
  // 获取不同类型数据 (分页/模糊)
  public async list() {
    const { ctx, service: { web } } = this;
    // 组装参数
    const payload = ctx.request.body || {};
     // 调用 Service 进行业务处理
    web.retcode.list(payload);
    ctx.helper.success();
  }

}
