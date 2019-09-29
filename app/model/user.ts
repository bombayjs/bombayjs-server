module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    user_name: { type: String }, // 用户名称
    password: { type: String }, // 用户密码
    system_ids: { type: Array }, // 用户所拥有的系统Id
    is_use: { type: Number, default: 0 }, // 是否禁用 0：正常  1：禁用
    level: { type: Number, default: 1 }, // 用户等级（0：管理员，1：普通用户）
  }, { timestamps: true });

  UserSchema.index({ user_name: -1 });

  return mongoose.model('User', UserSchema);
};

