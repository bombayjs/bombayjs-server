import { Controller } from 'egg';

export default class ReportController extends Controller {
  // web用户数据上报
  async webReport() {
    const { ctx } = this;
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Content-Type', 'application/json;charset=UTF-8');
    ctx.set('X-Response-Time', '2s');
    ctx.set('Connection', 'close');
    ctx.status = 200;

    const query = ctx.request.query;
    if (!query.appId) throw new Error('web端上报数据操作：app_id不能为空');

    query.ip = ctx.get('X-Real-IP') || ctx.get('X-Forwarded-For') || ctx.ip;
    query.url = query.url || ctx.headers.referer;
    query.user_agent = ctx.headers['user-agent'];
    // this.saveWebReportDataForRedis(query);
    this.saveWebReportDataForMongodb(ctx);
  }

  // 通过redis 消息队列消费数据
  async saveWebReportDataForRedis(query) {
    try {
      if (this.app.config.redis_consumption.total_limit_web) {
        // 限流
        const length = await this.app.redis.llen('web_repore_datas');
        if (length >= this.app.config.redis_consumption.total_limit_web) return;
      }
      // 生产者
      this.app.redis.lpush('web_repore_datas', JSON.stringify(query));
    } catch (e) { console.log(e); }
  }

  // 通过mongodb 数据库存储数据
  async saveWebReportDataForMongodb(ctx) {
    ctx.service.web.report.saveWebReportData(ctx);
  }
}
