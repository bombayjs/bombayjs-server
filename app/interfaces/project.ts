export interface IProject {
  project_name?: string; // 系统名称
  token?: string; // 秘钥，唯一
  app_id?: string | number; // 小程序appId标x识
  type?: string; // 浏览器：web  微信小程序 ：wx
  user_id?: Array<string | number>; // 应用所属用户ID
  is_use?: number; // 是否需要统计  1：是  0：否
  slow_page_time?: number; // 页面加载页面阀值  单位：s
  slow_js_time?: number; // js慢资源阀值 单位：s
  slow_css_time?: number; // 慢加载css资源阀值  单位：S
  slow_img_time?: number; // 慢图片加载资源阀值  单位:S
  slow_ajax_time?: number; // AJAX加载阀值
  is_statisi_pages?: number; // 是否统计页面性能信息  1：是  0：否
  is_statisi_ajax?: number; // 是否统计页面Ajax性能资源 1：是  0：否
  is_statisi_resource?: number; // 是否统计页面加载资源性能信息 1：是  0：否
  is_statisi_system?: number; // 是否存储用户系统信息资源信息 1：是  0：否
  is_statisi_error?: number; // 是否上报页面错误信息  1：是  0：否
  is_daily_use?: number; // 是否发送日报  1：是  0：否
  daliy_list?: Array<any>; // 日报列表
  is_highest_use?: number; // 是否发送pv邮件  1：是  0：否
  highest_list?: Array<any>;
}
