module.exports = app => {
  const mongoose = app.mongoose;
  // const Schema = mongoose.Schema;
  const ProjectSchema = new mongoose.Schema({
    project_name: { type: String }, // 系统名称
    token: { type: String }, // 秘钥，唯一
    url: { type: String }, // 网站url
    app_id: { type: String }, // 小程序appId标识
    type: { type: String, default: 'web' }, // 浏览器：web  微信小程序 ：wx
    // group_id: { type: Array }, // 应用所属分组ID
    user_id: { type: Array }, // 应用所属用户ID
    is_use: { type: Number, default: 1 }, // 是否需要统计  1：是  0：否
    slow_page_time: { type: Number, default: 5 }, // 页面加载页面阀值  单位：s
    slow_js_time: { type: Number, default: 2 }, // js慢资源阀值 单位：s
    slow_css_time: { type: Number, default: 2 }, // 慢加载css资源阀值  单位：S
    slow_img_time: { type: Number, default: 2 }, // 慢图片加载资源阀值  单位:S
    slow_ajax_time: { type: Number, default: 2 }, // AJAX加载阀值
    is_statisi_pages: { type: Number, default: 1 }, // 是否统计页面性能信息  1：是  0：否
    is_statisi_ajax: { type: Number, default: 1 }, // 是否统计页面Ajax性能资源 1：是  0：否
    is_statisi_resource: { type: Number, default: 1 }, // 是否统计页面加载资源性能信息 1：是  0：否
    is_statisi_system: { type: Number, default: 1 }, // 是否存储用户系统信息资源信息 1：是  0：否
    is_statisi_error: { type: Number, default: 1 }, // 是否上报页面错误信息  1：是  0：否
    is_daily_use: { type: Number, default: 1 }, // 是否发送日报  1：是  0：否
    daliy_list: { type: Array }, // 日报列表
    is_highest_use: { type: Number, default: 1 }, // 是否发送pv邮件  1：是  0：否
    highest_list: { type: Array }, // 突破历史pv峰值时发送邮件列表
  }, { timestamps: true });
  ProjectSchema.index({ token: -1, user_id: -1 });
  return mongoose.model('Project', ProjectSchema);
};
