import Report from './web_report';

module.exports = app => {
  const mongoose = app.mongoose;
  const schema = new mongoose.Schema({
    ...Report,
    dom: { type: Number },
    load: { type: Number },
    res: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ResTime' }],
  }, { timestamps: true });
  schema.index({ t: 1, page: 1 });
  schema.index({ page: 1 });

  app.models.WebRes = (token: string) => {
    return mongoose.model(`web_res_${token}`, schema);
  };
};
