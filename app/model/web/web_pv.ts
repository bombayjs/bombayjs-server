import Report from './web_report';

module.exports = app => {
  const mongoose = app.mongoose;
  const schema = new mongoose.Schema({
    ...Report,
    dt: { type: String },
    dl: { type: String },
    dr: { type: String },
    dpr: { type: Number },
    de: { type: String },
  }, { timestamps: true });
  schema.index({ t: 1, page: 1 });
  schema.index({ page: 1 });

  app.models.WebPv = (token: string) => {
    return mongoose.model(`web_pv_${token}`, schema);
  };
};
