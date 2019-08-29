import { Service } from 'egg';
const crypto = require('crypto');

/**
 * Test Service
 */
export default class User extends Service {

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
      // this.app.redis.set(`${token}_user_login`, JSON.stringify(result), 'EX', this.app.config.user_login_timeout);
      // 设置登录cookie
      this.ctx.cookies.set('usertoken', token, {
          maxAge: this.app.config.user_login_timeout * 1000,
          httpOnly: true,
          encrypt: true,
          signed: true,
      });

      result.success = true;

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
