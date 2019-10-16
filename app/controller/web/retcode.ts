import { Controller } from 'egg';

export default class RetcodeController extends Controller {
  constructor(ctx) {
    super(ctx);
  }
  /**
   * *******************************************************************************************
   * 获取 es 聚合数据
   * body 格式
   *  {
   *  "metric":"webstat.url",
   *  "dimensions":["page"], 维度参数
   *  "measures":["pv","uv", "t"], //指标参数
   *  "filters":{"token": "tRhxanr1569391219724"}, 过滤条件
   *  "intervalMillis": "1m", 分段时间
   *  "startTime":1570171354481, 开始时间
   *  "endTime":1570869602914, 结束时间
   *  "orderBy":"pv", 排序字段
   *  "order":"DESC" 排序方式
   *  }
   * *******************************************************************************************
   */
  public async list() {
    const { ctx, service: { web } } = this;
    // 组装参数
    const payload = ctx.request.body || {};
    let res = {};
    const { metric, dimensions } = payload;
    // 维度聚合
    if (metric === 'webstat.url' && dimensions && dimensions.length > 0) {
      res = await web.retcode.dimension(payload);
    } else {
      res = await web.retcode.indicator(payload);
    }
    ctx.helper.success(res);
  }
  public async search() {
    const { ctx, service: { web } } = this;
    const payload = ctx.request.body || {};
    let res = {};
    res = await web.retcode.search(payload);
    ctx.helper.success(res);
  }
}
