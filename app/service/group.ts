import { Service } from 'egg';


export default class PageVariateService extends Service {
  listValidate: any;

  constructor(props) {
    super(props);
    
    this.listValidate = {
      project_token: { type: 'string', required: true, trim: true, desc: '请选择项目' },
    }
  }
  async get() {
    const { ctx } = this;
    // const query = ctx.request.body;
    // 参数校验
    ctx.validate(this.listValidate);
    if (ctx.paramErrors) {
      // get error infos from `ctx.paramErrors`;
      return this.app.retError(ctx.paramErrors[0].desc);
    }

    // const cond: any = {
    //   project_token: query.project_token,
    // };
    // // const page = ctx.model.PageVariate.find(cond);
    // // const event = ctx.model.EventVariate.find(cond);
    // // const [ rPage, rEvent ] = await Promise.all([ page, event ]);
    // console.log(rPage, rEvent)
    // const result = [ ...rPage, ...rEvent ];
    const result = [
      {
          id: 'tm',
          name: '时间',
          groupId: 'normal',
          groupName: '常用维度',
          type: 'global',
      },
      {
          id: 'p',
          name: '页面',
          groupId: 'normal',
          groupName: '常用维度',
          type: 'global',
      },
      {
          id: 'rp',
          name: '页面来源',
          groupId: 'normal',
          groupName: '常用维度',
          type: 'global',
      },
      {
          id: 'b',
          name: '平台（网站/手机应用）',
          groupId: 'normal',
          groupName: '常用维度',
          type: 'global',
      },
      {
          id: 'rd',
          name: '访问来源',
          groupId: 'origin',
          groupName: '用户来源',
          type: 'global',
      },
      {
          id: 'rt',
          name: '一级访问来源',
          groupId: 'origin',
          groupName: '用户来源',
          type: 'global',
      },
      {
          id: 'kw',
          name: '搜索词',
          groupId: 'origin',
          groupName: '用户来源',
          type: 'global',
      },
      {
          id: 'utm_source',
          name: '广告来源',
          groupId: 'origin',
          groupName: '用户来源',
          type: 'global',
      },
      {
          id: 'utm_campaign',
          name: '广告名称',
          groupId: 'origin',
          groupName: '用户来源',
          type: 'global',
      },
      {
          id: 'utm_content',
          name: '广告内容',
          groupId: 'origin',
          groupName: '用户来源',
          type: 'global',
      },
      {
          id: 'utm_term',
          name: '广告关键字',
          groupId: 'origin',
          groupName: '用户来源',
          type: 'global',
      },
      {
          id: 'utm_medium',
          name: '广告媒介',
          groupId: 'origin',
          groupName: '用户来源',
          type: 'global',
      },
      {
          id: 'wlink_id',
          name: '网页监测链接',
          groupId: 'origin',
          groupName: '用户来源',
          type: 'global',
      },
      {
          id: 'city',
          name: '城市',
          groupId: 'geo',
          groupName: '地域信息',
          type: 'global',
      },
      {
          id: 'region',
          name: '地区',
          groupId: 'geo',
          groupName: '地域信息',
          type: 'global',
      },
      {
          id: 'countryCode',
          name: '国家代码',
          groupId: 'geo',
          groupName: '地域信息',
          type: 'global',
      },
      {
          id: 'countryName',
          name: '国家名称',
          groupId: 'geo',
          groupName: '地域信息',
          type: 'global',
      },
      {
          id: 'bw',
          name: '浏览器',
          groupId: 'device',
          groupName: '设备信息',
          type: 'global',
      },
      {
          id: 'bwv',
          name: '浏览器版本',
          groupId: 'device',
          groupName: '设备信息',
          type: 'global',
      },
      {
          id: 'os',
          name: '操作系统',
          groupId: 'device',
          groupName: '设备信息',
          type: 'global',
      },
      {
          id: 'osv',
          name: '操作系统版本',
          groupId: 'device',
          groupName: '设备信息',
          type: 'global',
      },
      {
          id: 'shw',
          name: '屏幕大小（高*宽）',
          groupId: 'device',
          groupName: '设备信息',
          type: 'global',
      },
      {
          id: 'l',
          name: '操作系统语言',
          groupId: 'device',
          groupName: '设备信息',
          type: 'global',
      },
      {
          id: 'db',
          name: '设备品牌',
          groupId: 'device',
          groupName: '设备信息',
          type: 'global',
      },
      {
          id: 'dm',
          name: '设备型号',
          groupId: 'device',
          groupName: '设备信息',
          type: 'global',
      },
      {
          id: 'ph',
          name: '设备类型',
          groupId: 'device',
          groupName: '设备信息',
          type: 'global',
      },
  ];

    return this.app.retResult(result);
  }
}
