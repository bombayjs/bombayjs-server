import { Service } from 'egg';
import { ObjectId } from '_@types_bson@4.0.0@@types/bson';

class BaseService extends Service {
  constructor(props) {
    super(props);
  }
  /**
   * 保存上报数据
   * @param payload
   */
  public async create(payload) {
    const { t, token } = payload;
    const collectionName = `web_${t}_${token.toLowerCase()}`;
    const model = await this.ctx.getModel(collectionName);
    if (t === 'res') {
      return this.createRes(payload, model);
    }
    return await model.create(payload);
  }
  /**
   *
   * @param payload 创建资源表
   * @param model
   */
  public async createRes(payload, model) {
    const { resTimes } = payload;
    const pAll: Array<Promise<any>> = [];
    JSON.parse(resTimes || '[]').reduce((previousValue, currentValue) => {
      pAll.push(this.ctx.model.ResTime.create(currentValue));
      return previousValue;
    }, pAll);
    const result = await Promise.all(pAll);
    const objIds: ObjectId[] = [];
    result.map(item => {
      objIds.push(item._id);
    });
    payload.res = objIds;
    return await model.create(payload);
  }
}

module.exports = BaseService;
