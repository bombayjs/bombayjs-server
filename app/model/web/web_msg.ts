import Report from './web_report';

module.exports = app => {
  const mongoose = app.mongoose;
  const schema = new mongoose.Schema({
    ...Report,
    group: { type: String },
    msg: { type: String },
  }, { timestamps: true });
  schema.index({ t: 1, page: 1 });
  schema.index({ page: 1 });

  app.models.WebMsg = (token: string) => {
    return mongoose.model(`web_msg_${token}`, schema);
  };
};
