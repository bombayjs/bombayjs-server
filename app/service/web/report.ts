import { Service, Context } from 'egg';
class ReportService extends Service {
  constructor(ctx: Context) {
    super(ctx);
  }
  // 所以上报数据保存
  async save(payload) {
    const { t, token } = payload;
    const modelName = `Web${this.ctx.helper.capitalize(t)}`;
    const collectionName = `web_${t}_${token.toLowerCase()}`;
    await this.ctx.createModel(modelName, token, collectionName);
    await this.service.web.base.create(payload);
  }
}

module.exports = ReportService;
