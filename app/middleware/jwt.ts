// 校验用户是否登录
import * as jwt from 'jsonwebtoken';

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.header && ctx.header.authorization) {
      const parts = ctx.header.authorization.split(' ');
      if (parts.length === 2) {
        // 取出token
        const scheme = parts[0];
        const token = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          try {
            // jwt.verify方法验证token是否有效
            const decoded = jwt.verify(token, ctx.app.config.jwt.secret);
            ctx.currentUserId = decoded.id;
            await next();
          } catch (err) {
            if (err.name === 'TokenExpiredError') {
              ctx.status = 401;
              ctx.body = 'Token Expired';
            } else if (err.name === 'JsonWebTokenError') {
              ctx.status = 401;
              ctx.body = 'Invalid Token';
            } else {
              throw err;
            }
          }
        }
      } else {
        ctx.status = 401;
        ctx.body = 'Missing Auth Token';
      }
    } else {
      ctx.status = 401;
      ctx.body = 'Missing Auth Token';
    }
  };
};
