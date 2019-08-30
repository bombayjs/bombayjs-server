import { Service } from 'egg';
const crypto = require('crypto');

/**
 * Test Service
 */
export default class UserService extends Service {

  /* 用户登录
    * @param {*} userName
    * @param {*} passWord
    * @return
    * @memberof UserService
  */
  async login(ctx) {
    const query = ctx.request.body;
    const userName = query.userName;
    const passWord = query.passWord;

    if (!userName) return this.app.retError('用户登录：userName不能为空');
    if (!passWord) return this.app.retError('用户登录：passWord不能为空');

    const userInfo = await this.getUserInfoForUserName(userName) || {};
    const newPwd = crypto.createHmac('sha256', passWord)
        .update(this.app.config.user_pwd_salt_addition)
        .digest('hex');

    if (userInfo.pass_word !== newPwd) return this.app.retError('用户密码不正确！');
    if (userInfo.is_use !== 0) return this.app.retError('用户被冻结不能登录，请联系管理员！');

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

    return this.app.retResult({
      data: userInfo,
    });
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
  async register(ctx) {
    const query = ctx.request.body;
    const userName = query.userName;
    const passWord = query.passWord;

    if (!userName) return this.app.retError('用户登录：userName不能为空');
    if (!passWord) return this.app.retError('用户登录：passWord不能为空');

    // 检测用户是否存在
    const userInfo = await this.getUserInfoForUserName(userName);
    if (userInfo.token) return this.app.retError('用户名不存在！');

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

    return this.app.retResult({
      data: result,
    });
  }

  /* 根据用户名称查询用户信息
    * @param {*} userName
    * @returns
    * @memberof UserService
    */
  async getUserInfoForUserName(userName) {
    return await this.ctx.model.User.findOne({ user_name: userName }).exec() || {};
  }

  /* 登出
    * @param {*} usertoken
    * @returns
    * @memberof UserService
  */
  logout(ctx) {
    const usertoken = ctx.cookies.get('usertoken', {
      encrypt: true,
      signed: true,
    }) || '';
    if (!usertoken) return this.app.retError('退出登录：token不能为空');

    this.ctx.cookies.set('usertoken', '');
    this.app.redis.set(`${usertoken}_user_login`, '');
    return this.app.retResult({
      data: {},
    });
  }

  /* 冻结解冻用户
    * @param {*} id
    * @param {*} isUse
    * @param {*} usertoken
    * @returns
    * @memberof UserService
  */
  async setIsUse(ctx) {
    const query = ctx.request.body;
    let isUse = query.isUse || 0;
    const id = query.id || '';
    const usertoken = query.usertoken || '';

    if (!id) return this.app.retError('冻结解冻用户：id不能为空');

    // 冻结用户信息
    isUse = isUse * 1;
    const result = await this.ctx.model.User.update(
        { _id: id },
        { is_use: isUse },
        { multi: true }
    ).exec();
    // 清空登录态
    this.app.redis.set(`${usertoken}_user_login`, '');
    return this.app.retResult({
      data: result,
    });
  }

  /* 删除用户
  * @param {*} id
  * @param {*} usertoken
  * @returns
  * @memberof UserService
  */
  async delete(ctx) {
    const query = ctx.request.body;
    const id = query.id || '';
    const usertoken = query.usertoken || '';
    if (!id) return this.app.retError('删除用户：id不能为空');
    // 删除
    const result = await this.ctx.model.User.findOneAndRemove({ _id: id }).exec();
    // 清空登录态
    if (usertoken) this.app.redis.set(`${usertoken}_user_login`, '');
    return this.app.retResult({
      data: result,
    });
  }

  /* 根据token查询用户信息
    * @param {*} usertoken
    * @returns
    * @memberof UserService
  */
  async finUserForToken(usertoken) {
    let user_info: any = await this.app.redis.get(`${usertoken}_user_login`);

    if (user_info) {
        user_info = JSON.parse(user_info);
        if (user_info.is_use !== 0) return { desc: '用户被冻结不能登录，请联系管理员！' };
    } else {
        return null;
    }
    return await this.ctx.model.User.findOne({ token: user_info.token }).exec();
}
}
