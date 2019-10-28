import { Controller } from 'egg';
// tslint:disable-next-line:no-var-requires
const detector = require('detector');
// frontend-event-log-web-report-collect-*
interface Ibody {
  res?: any;
  err?: any;
  token?: string;
  behavior: {};
}
export default class ReportController extends Controller {
  constructor(ctx) {
    super(ctx);
  }
  public VReport = {
    t: { type: 'string', required: true, allowEmpty: false }, // 类型
    times: { type: 'number', required: false }, // 次数
    page: { type: 'string', required: false }, // 页面
    v: { type: 'string', required: false }, // 版本
    e: { type: 'string', required: false }, // 开发生产环境
    token: { type: 'string', required: true, allowEmpty: false }, // 项目id
    begin: { type: 'number', required: false }, // 开始时间戳
    sr: { type: 'string', required: false }, // 屏幕分辨率
    vp: { type: 'string', required: false }, // view 分辨率
    _v: { type: 'string', required: false }, // 脚本sdk版本
    o: { type: 'string', required: false }, // 原始url
    uid: { type: 'string', required: false }, // user id
    sid: { type: 'string', required: false }, // session id
    ct: { type: 'string', required: false }, // 网络
    ul: { type: 'string', required: false }, // 语言
    dt: { type: 'string', required: false }, // document title
    dl: { type: 'string', required: false }, // document location
    dr: { type: 'string', required: false }, // 来源
    dpr: { type: 'number', required: false }, // dpr
    de: { type: 'string', required: false }, // ocument 编码
    st: { type: 'string', required: false }, // sub type
    msg: { type: 'string', required: false }, // 信息
    cate: { type: 'string', required: false }, // 类别
    detail: { type: 'string', required: false }, // 错误栈 或 出错标签
    file: { type: 'string', required: false }, // 出错文件
    line: { type: 'number', required: false }, // 行
    col: { type: 'number', required: false }, // 列
    dom: { type: 'number', required: false }, // 所有解析时间 domInteractive - responseEnd
    load: { type: 'number', required: false }, // 所有资源加载完时间 loadEventStart- fetchStart
    res: { type: 'string', required: false }, //
    url: { type: 'string', required: false }, // 接口
    success: { type: 'boolean', required: false }, // 成功
    time: { type: 'number', required: false }, // 成功
    code: { type: 'number', required: false }, // 接口返回的code
    healthy: { type: 'number', required: false }, // 健康？ 0/1
    stay: { type: 'number', required: false }, // 停留时间
    errcount: { type: 'number', required: false }, //  error次数
    apisucc: { type: 'number', required: false }, //  api成功次数
    apifail: { type: 'number', required: false }, //  api错误次数
    dns: { type: 'number', required: false }, //  dns时间
    tcp: { type: 'number', required: false }, //  tcp时间
    ssl: { type: 'number', required: false }, //  ssl时间
    ttfb: { type: 'number', required: false }, //  ResponseStart - RequestStart (首包时间，关注网络链路耗时)
    trans: { type: 'number', required: false }, //  停留时间
    firstbyte: { type: 'number', required: false }, //   首字节时间
    fpt: { type: 'number', required: false }, //   ResponseEnd - FetchStart （首次渲染时间 / 白屏时间）
    tti: { type: 'number', required: false }, //   DomInteractive - FetchStart （首次可交付时间）
    ready: { type: 'number', required: false }, //  DomContentLoadEventEnd - FetchStart （加载完成时间）
    bandwidth: { type: 'number', required: false }, //  估计的带宽 单位M/s
    navtype: { type: 'string', required: false }, //  nav方式 如reload
    fmp: { type: 'number', required: false }, // 停留时间
    resTimes: { type: 'string', required: false },
  };
  public toNumberParas = [ 'times', 'begin', 'dpr', 'line', 'col', 'dom', 'load', 'time', 'code', 'healthy', 'stay', 'errcount', 'apisucc', 'apifail', 'dns', 'tcp', 'ssl', 'ttfb', 'trans', 'firstbyte', 'fpt', 'tti', 'ready', 'bandwidth', 'fmp' ];
  /**
   * *******************************************************************************************
   * web用户数据上报保存到kafka
   * *******************************************************************************************
   */
  public async create() {
    const { ctx, service } = this;
    const body = await this.adapterBody();
    ctx.validate(this.VReport, body);
    const { token } = body;
    if (token) {
      const tokenObj = await this.service.project.getProjectByToken(token);
      if (tokenObj && tokenObj.is_use === 1) {
        const { report } = service.web;
        await report.save(body);
      }
    }
    ctx.helper.success();
  }
  /**
   * *******************************************************************************************
   * 组装上报参数
   * *******************************************************************************************
   */
  public async adapterBody() {
    const { ctx, service } = this;
    let body: Ibody = ctx.request.body;
    if (body && typeof body === 'string') {
      body = JSON.parse(body);
    }
    this.toNumberParas.map(item => {
      if (ctx.query[item]) {
        ctx.query[item] = +ctx.query[item];
      }
    });
    const ip = ctx.get('X-Real-IP') || ctx.get('X-Forwarded-For') || ctx.ip;
    const location = await service.web.report.getLocation(ip);
    // const url = ctx.url || ctx.headers.referer;
    const user_agent = ctx.headers['user-agent'];
    const device = detector.parse(user_agent);
    return { ...ctx.query, detector: device, body: body || {}, ...location, ip, pv: 1, uv: ip, user_agent, '@timestamp' : new Date() };
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
    } catch (e) {
      console.log(e);
    }
  }

  // 通过mongodb 数据库存储数据
  async saveWebReportDataForMongodb(ctx) {
    ctx.service.web.report.saveWebReportData(ctx);
  }
}
