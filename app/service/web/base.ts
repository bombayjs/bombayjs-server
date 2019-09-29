import { Service } from 'egg';

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
    const collectionName = `web_${t}_${token}`;
    const model = this.ctx.getModel(collectionName);
    return model.create(payload);
  }

}

module.exports = BaseService;
