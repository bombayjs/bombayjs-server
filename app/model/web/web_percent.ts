import Report from './web_report';

module.exports = app => {
  const mongoose = app.mongoose;
  const schema = new mongoose.Schema({
    ...Report,
    dns: { type: Number },
    tcp: { type: Number },
    ssl: { type: Number },
    ttfb: { type: Number },
    trans: { type: Number },
    dom: { type: Number },
    res: { type: Number },
    firstbyte: { type: Number },
    fpt: { type: Number },
    tti: { type: Number },
    ready: { type: Number },
    load: { type: Number },
    bandwidth: { type: Number },
    navtype: { type: String },
    fmp: { type: Number },
  }, { timestamps: true });
  schema.index({ t: 1, page: 1 });
  schema.index({ page: 1 });

  app.models.WebPercent = (token: string) => {
    return mongoose.model(`web_percent_${token}`, schema);
  };
};
