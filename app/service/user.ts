import { Service } from 'egg';
const crypto = require('crypto');

/**
 * Test Service
 */
export default class User extends Service {

  /* 用户登录
    * @param {*} userName
    * @param {*} passWord
    * @return
    * @memberof UserService
  */
  async login(userName, passWord) {
    const userInfo = await this.getUserInfoForUserName(userName) || {};
    const newPwd = crypto.createHmac('sha256', passWord)
        .update(this.app.config.user_pwd_salt_addition)
        .digest('hex');

    if (userInfo.pass_word !== newPwd) return '用户密码不正确！';
    if (userInfo.is_use !== 0) return '用户被冻结不能登录，请联系管理员！';

    // 清空以前的登录态
    if (userInfo.usertoken) this.app.redis.set(`${userInfo.usertoken}_user_login`, '');

    // 设置新的redis登录态
    const random_key = this.app.randomString();
    this.app.redis.set(`${random_key}_user_login`, JSON.stringify(userInfo), 'EX', this.app.config.user_login_timeout);
    // 设置登录cookie
    this.ctx.cookies.set('usertoken', random_key, {
        maxAge: this.app.config.user_login_timeout * 1000,
        httpOnly: true,
        encrypt: true,
        signed: true,
    });
    // 更新用户信息
    await this.updateUserToken({ username: userName, usertoken: random_key });

    return userInfo;
  }

  /* 更新用户登录态随机数
    * @param {*} opt
    * @returns
    * @memberof UserService
    */
  async updateUserToken(opt) {
    const query: any = {};
    if (opt.username) {
        query.user_name = opt.username;
    } else if (opt.token) {
        query.token = opt.token;
    }
    const result = await this.ctx.model.User.update(
        query,
        { usertoken: opt.usertoken },
        { multi: true },
    ).exec();

    return result;
  }

  /* 用户注册
    * @param {*} userName
    * @param {*} passWord
    * @returns
    * @memberof UserService
  */
  async register(userName, passWord) {
    // 检测用户是否存在
    const userInfo = await this.getUserInfoForUserName(userName);
    if (userInfo.token) {
      return '用户名不存在！';
    }

    const newPwd = crypto.createHmac('sha256', passWord)
        .update(this.app.config.user_pwd_salt_addition)
        .digest('hex');

    // 新增用户
    const token = this.app.randomString();
    const user = new this.ctx.model.User();
    user.user_name = userName;
    user.pass_word = newPwd;
    user.token = token;
    user.create_time = new Date();
    user.level = userName === 'admin' ? 0 : 1;
    user.usertoken = token;
    const result = await user.save() || {};
    result.pass_word = '';

    // 设置redis登录态
    this.app.redis.set(`${token}_user_login`, JSON.stringify(result), 'EX', this.app.config.user_login_timeout);
    // 设置登录cookie
    this.ctx.cookies.set('usertoken', token, {
        maxAge: this.app.config.user_login_timeout * 1000,
        httpOnly: true,
        encrypt: true,
        signed: true,
    });

    return result;
  }

  /* 根据用户名称查询用户信息
    * @param {*} userName
    * @returns
    * @memberof UserService
    */
  async getUserInfoForUserName(userName) {
    return await this.ctx.model.User.findOne({ user_name: userName }).exec() || {};
  }

}
