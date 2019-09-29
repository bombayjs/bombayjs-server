import { Service } from 'egg';
// tslint:disable-next-line:no-var-requires
const crypto = require('crypto');
// tslint:disable-next-line:no-var-requires
const _ = require('lodash');

/**
 * Test Service
 */
export default class UserService extends Service {

  /* 用户登录
    * @param {*} userName
    * @param {*} password
    * @return
    * @memberof UserService
  */
  async login(ctx) {
    const query = ctx.request.body;
    const userName = query.userName;
    const password = query.password;

    if (!userName) return this.app.retError('用户登录：userName不能为空');
    if (!password) return this.app.retError('用户登录：passWord不能为空');

    const userInfo = await this.getUserInfoForUserName(userName) || {};
    const newPwd = crypto.createHmac('sha256', password)
        .update(this.app.config.user_pwd_salt_addition)
        .digest('hex');

    if (userInfo.password !== newPwd) return this.app.retError('用户密码不正确！');
    if (userInfo.is_use !== 0) return this.app.retError('用户被冻结不能登录，请联系管理员！');

    const token = await this.service.actionToken.apply(userInfo._id);
    console.log(token);
    this.app.redis.set(`${userInfo._id}_user_login`, JSON.stringify(userInfo), 'EX', this.app.config.user_login_timeout);
    const returnUser = _.pick(userInfo, [ 'system_ids', 'is_use', 'level', 'createdAt', 'user_name', ]);
    returnUser.token = token;
    returnUser.id = userInfo._id;
    return this.app.retResult(returnUser);
  }

  /* 用户注册
    * @param {*} userName
    * @param {*} password
    * @returns
    * @memberof UserService
  */
  async register(ctx) {
    const query = ctx.request.body;
    const userName = query.userName;
    const password = query.password;

    if (!userName) return this.app.retError('用户登录：userName不能为空');
    if (!password) return this.app.retError('用户登录：passWord不能为空');

    // 检测用户是否存在
    const userInfo = await this.getUserInfoForUserName(userName);
    if (userInfo._id) return this.app.retError('用户已存在！');

    const newPwd = crypto.createHmac('sha256', password)
        .update(this.app.config.user_pwd_salt_addition)
        .digest('hex');

    // 新增用户
    const user = new this.ctx.model.User();
    user.user_name = userName;
    user.password = newPwd;
    user.level = userName === 'admin' ? 0 : 1;
    const result = await user.save() || {};
    result.password = '';

    return this.app.retResult(result);
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
  async logout(ctx) {
    const id = ctx.currentUserId;
    const token = await this.service.actionToken.apply(id);
    this.app.redis.set(`${id}_user_login`, '');
    return this.app.retResult({ token });
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
    if (!id) return this.app.retError('冻结解冻用户：id不能为空');

    // 冻结用户信息
    isUse = isUse * 1;
    const result = await this.ctx.model.User.update(
        { _id: id },
        { is_use: isUse },
        { multi: true },
    ).exec();
    // 清空登录态
    return this.app.retResult(result);
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
    if (!id) return this.app.retError('删除用户：id不能为空');
    // 删除
    const result = await this.ctx.model.User.findOneAndRemove({ _id: id }).exec();
    // 清空登录态
    return this.app.retResult(result);
  }

   /* 根据token查询用户信息
    * @param {*} usertoken
    * @returns
    * @memberof UserService
  */
  async currentUser(ctx) {
    const id = ctx.currentUserId;
    let user_info: any = await this.app.redis.get(`${id}_user_login`);
    if (user_info) {
      user_info = JSON.parse(user_info);
      if (user_info.is_use !== 0) return this.app.retError('获取当前用户信息：用户被冻结不能登录，请联系管理员！');
    } else {
      user_info = await this.ctx.model.User.findOne({ _id: id }).exec();
    }

    if (user_info) {
      const returnUser = _.omit(user_info, [ 'password', '_id' ]);
      returnUser.id = user_info._id;
      return this.app.retResult(returnUser);
    } else {
      return this.app.retError('获取当前用户信息：用户不存在');
    }
  }

}
