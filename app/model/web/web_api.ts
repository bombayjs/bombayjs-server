import Report from './web_report';

module.exports = app => {
  const mongoose = app.mongoose;
  const schema = new mongoose.Schema({
    ...Report,
    url: { type: String }, // 类别
    success: { type: Boolean }, // 成功？
    time: { type: Number }, // 耗时
    code: { type: Number }, // 接口返回的code
    msg: { type: String }, // 信息
  }, { timestamps: true });
  schema.index({ t: 1, page: 1 });
  schema.index({ page: 1 });

  app.models.WebApi = (token: string) => {
    return mongoose.model(`web_api_${token}`, schema);
  };
};
