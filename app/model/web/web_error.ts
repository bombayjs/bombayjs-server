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
  }, { timestamps: true });
  schema.index({ t: 1, page: 1 });
  schema.index({ page: 1 });

  app.models.WebError = (token: string) => {
    return mongoose.model(`web_error_${token}`, schema);
  };
};
