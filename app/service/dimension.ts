import { Service } from 'egg';
import * as bodybuilder from 'bodybuilder';

export default class PageVariateService extends Service {
  listValidate: any;
  getValidate: any;

  constructor(props) {
    super(props);
    this.listValidate = {
      project_token: { type: 'string', required: true, trim: true, desc: '请选择项目' },
    };
    this.getValidate = {
      project_token: { type: 'string', required: true, trim: true, desc: '请选择项目' },
      dimension: { type: 'string', required: true, trim: true, desc: '请选择维度' },
    };
  }
  async list() {
    const { ctx } = this;
    // const query = ctx.request.body;
    // 参数校验
    ctx.validate(this.listValidate);
    if (ctx.paramErrors) {
      // get error infos from `ctx.paramErrors`;
      return this.app.retError(ctx.paramErrors[0].desc);
    }
    const result = [
      {
          id: 'page',
          name: '页面',
          groupId: 'normal',
          groupName: '常用维度',
          type: 'global',
      },
      {
          id: 'dr',
          name: '页面来源',
          groupId: 'normal',
          groupName: '常用维度',
          type: 'global',
      },
      {
        id: 'sr',
        name: '屏幕分辨率',
        groupId: 'normal',
        groupName: '常用维度',
        type: 'global',
      },
      {
        id: 'ct',
        name: '网络',
        groupId: 'normal',
        groupName: '常用维度',
        type: 'global',
      },
      {
        id: 'ul',
        name: '语言',
        groupId: 'normal',
        groupName: '常用维度',
        type: 'global',
      },
      {
          id: 'ad_info.city',
          name: '省市',
          groupId: 'geo',
          groupName: '地域信息',
          type: 'global',
      },
      {
          id: 'ad_info.city',
          name: '城市',
          groupId: 'geo',
          groupName: '地域信息',
          type: 'global',
      },
      {
          id: 'ad_info.nation',
          name: '国家名称',
          groupId: 'geo',
          groupName: '地域信息',
          type: 'global',
      },
      {
          id: 'detector.browser.name',
          name: '浏览器',
          groupId: 'device',
          groupName: '设备信息',
          type: 'global',
      },
      {
          id: 'detector.os.name',
          name: '操作系统',
          groupId: 'device',
          groupName: '设备信息',
          type: 'global',
      },
      {
          id: 'detector.device.name',
          name: '设备品牌',
          groupId: 'device',
          groupName: '设备信息',
          type: 'global',
      },
  ];

    return this.app.retResult(result);
  }

  async get() {
    const { ctx } = this;
    const query = ctx.request.body;
    // 参数校验
    ctx.validate(this.getValidate);
    if (ctx.paramErrors) {
      // get error infos from `ctx.paramErrors`;
      return this.app.retError(ctx.paramErrors[0].desc);
    }
    const body = bodybuilder()
      .size(0)
      .query('term', 'token', query.project_token)
      .query('term', 't', 'pv')
      .agg('terms', `${query.dimension}.keyword`, 'results')
      .build();
    const result = await this.app.elasticsearch.search({
      index: 'frontend-event-log-web-report-collect-*',
      type: '_doc',
      body,
    });
    return this.app.retResult(result.aggregations.results.buckets);
  }
}
