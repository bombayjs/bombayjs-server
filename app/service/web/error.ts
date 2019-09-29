import { Service } from 'egg';
// tslint:disable-next-line:no-var-requires
const _ = require('lodash');

export default class ErrorService extends Service {
  listValidator: any;

  constructor(props) {
    super(props);
    this.listValidator = {
      key: { type: 'string', required: true, trim: true, range: { in: this.config.report_filter }, desc: '类型不正确' },
      token: { type: 'string', required: true, trim: true, desc: '请选择项目' },
      begin: { type: 'date', required: true, trim: true, desc: '请选择开始时间' },
      end: { type: 'date', required: true, trim: true, desc: '请选择结束时间' },
    };
  }

  // 获得列表信息
  async list(ctx) {
    const { key, token, begin, end } = ctx.request.body;
    ctx.validate(this.listValidator);
    if(ctx.paramErrors) {
      // get error infos from `ctx.paramErrors`;
      return this.app.retError(ctx.paramErrors[0].desc);
    }
    const result = await ctx.app.models.webError(token).aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(begin), $lte: new Date(end) },
        },
      },
      {
        $group: {
          _id: '$' + key,
          count: { $sum: 1 },
        },
      },
    ]).exec();
    return this.app.retResult(result);
  }

  // 获取详情
  async filterList(ctx) {
    const { key, token, begin, end, value, type = 'error' } = ctx.request.body;
    ctx.validate(this.listValidator);
    if(ctx.paramErrors) {
      // get error infos from `ctx.paramErrors`;
      return this.app.retError(ctx.paramErrors[0].desc);
    }
    const model = ctx.app.models[`web${_.capitalize(type)}`];
    if (!model) return this.app.retError('不存在的错误类型');
    // const result = await model(token).find()
    //   .where({ createdAt: { $gte: new Date(begin), $lte: new Date(end) } })
    //   .where({ [key]: value })
    //   .exec();
    const result = await model(token).aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(begin), $lte: new Date(end) },
          [key]: value,
        },
      },
      {
        $group: {
          _id: '$msg',
          count: { $sum: 1 },
          lastTime: { $last: '$createdAt' },
          uids: { $addToSet: '$uid' },
        },
      },
    ])
    .addFields({
      uv: { $size: '$uids' },
    })
    .exec();
    return this.app.retResult(result);
  }

  // // 找同类型的错误
  // async fetchSameError(ctx) {

  // }

  // // 错误详情
  // async detail(ctx) {

  // }
}
