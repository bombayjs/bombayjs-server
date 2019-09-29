import Report from './web_report';

module.exports = app => {
  const mongoose = app.mongoose;
  const schema = new mongoose.Schema({
    ...Report,
    group: { type: String },
    key: { type: String },
    val: { type: Number },
  }, { timestamps: true });
  schema.index({ t: 1, page: 1 });
  schema.index({ page: 1 });

  app.models.WebSum = (token: string) => {
    return mongoose.model(`web_sum_${token}`, schema);
  };
};
