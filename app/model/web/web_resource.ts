import Report from './web_report';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const schema = new Schema({
    ...Report,
    msg: String,
    src: String,
    tagName: String,
  }, { timestamps: true });
  schema.index({ t: 1, page: 1 });
  schema.index({ page: 1 });

  app.models.webResource = (token: string) => {
    return mongoose.model(`web_resource_${token}`, schema);
  };
};
