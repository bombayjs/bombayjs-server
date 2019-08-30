import Report from './web_report';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const schema = new Schema({
    ...Report,
    cate: { type: String }, // 类别
    msg: { type: String }, // 信息
    stack: { type: String }, // 错误栈
    file: { type: String }, // 出错文件
    line: { type: Number, default: 0 }, // 行
    col: { type: Number, default: 0 }, // 列
  });
  schema.index({ t: 1, page: 1, create_time: -1 });
  schema.index({ page: 1, create_time: -1 });
  schema.index({ create_time: -1 });

  app.models.webErrors = (appId) => {
    return mongoose.model(`web_errors_${appId}`, schema);
  };
};
