import { Service, Context } from 'egg';

// tslint:disable-next-line:no-var-requires
const moment = require('moment');

class RetCodeService extends Service {
  constructor(ctx: Context) {
    super(ctx);
  }
  // 分页获取数据
  async list(payload) {
    const { start, end, query, token, currentPage, pageSize } = payload;
    const { ctx } = this;
    let res: [] = [];
    let total: number = 0;
    let code: number = 500;
    let message: string = 'success';
    const params = ctx.helper.decode(query);
    const filterQuery = { ...params, createdAt: { $gte: moment(Number(start)).format('YYYY-MM-DD HH:mm:ss'), $lte: moment(Number(end)).format('YYYY-MM-DD HH:mm:ss') } };
    const { t } = params;
    const sort = { createdAt: -1 };
    const collectionName = `web_${t}_${token.toLowerCase()}`;
    const model = await ctx.getModel(collectionName);
    const skip = ((Number(currentPage)) - 1) * Number(pageSize || 10);
    if (model) {
      res = await model.find(filterQuery).skip(skip).limit(Number(pageSize)).sort(sort).lean().exec();
      total = await model.count(filterQuery).exec();
      code = 200;
      message = 'success';
    }
    return { data: { items: res, page: currentPage, pageSize, total }, code, message };
  }

  public async webstat(payload) {
    console.dir(payload);
    const { ctx } = this;
    const { token } = payload;
    const collectionName = `web_pv_${token.toLowerCase()}`;
    // ctx.app.redis.set();
    const model = await ctx.getModel(collectionName);
    const res = await model.aggregate([
      { $group: { _id : '$page', count: { $sum: 1 } } },
      { $project: { _id : 0, page : '$_id', count: 1 } },
      { $sort: { count : -1 } },
      ]);
    return res;
  }
}

module.exports = RetCodeService;
