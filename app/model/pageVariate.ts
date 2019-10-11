
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;

  const EventVariateSchema = new Schema({
    user_id: ObjectId, // 创建人id
    project_token: { type: String }, // 项目token
    name: { type: String }, // 名称
    path: { type: String }, // 
    is_use: { type: Number, default: 0 }, // 是否禁用 0：正常  1：禁用
  }, { timestamps: true });
  EventVariateSchema.index({ name: -1, userId: -1 });
  return mongoose.model('PageVariate', EventVariateSchema);
};
