// 上报数据共享字段
export default {
  guid: { type: String }, // 唯一标识
  t: { type: String }, // 类型
  page: { type: String }, // 页面
  times: { type: Number, default: 0 }, // 次数
  v: { type: String }, // 版本
  appId: { type: String }, // 项目id
  e: { type: String }, // 环境
  begin: { type: Number, default: 0 }, // 开始时间戳
  uid: { type: String }, // user id
  sid: { type: String }, // session id
  dt: { type: String }, // document title
  dl: { type: String }, // document location
  dr: { type: String }, // 来源
  dpr: { type: Number, default: 0 }, // dpr
  de: { type: String }, // document 编码
  sr: { type: String }, // 屏幕分辨率
  vp: { type: String }, // view 分辨率
  ul: { type: String }, // 语言
  ct: { type: String }, // 网络
  _v: { type: String }, // 脚本sdk版本
  create_time: { type: Date, default: Date.now }, // 用户访问时间
};
