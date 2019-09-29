import Report from './web_report';

module.exports = app => {
  const mongoose = app.mongoose;
  const schema = new mongoose.Schema({
    ...Report,
  }, { timestamps: true });
  schema.index({ t: 1, page: 1 });
  schema.index({ page: 1 });

  app.models.WebPerf = (token: string) => {
    return mongoose.model(`web_perf_${token}`, schema);
  };
};
