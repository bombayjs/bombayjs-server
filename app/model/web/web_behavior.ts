import Report from './web_report';

module.exports = app => {
  const mongoose = app.mongoose;
  const schema = new mongoose.Schema({
    ...Report,
    healthy: { type: Number },
    stay: { type: Number },
    errcount: { type: Number },
    apisucc: { type: Number },
    apifail: { type: Number },
  }, { timestamps: true });
  schema.index({ t: 1, page: 1 });
  schema.index({ page: 1 });

  app.models.WebBehavior = (token: string) => {
    return mongoose.model(`web_behavior_${token}`, schema);
  };
};
