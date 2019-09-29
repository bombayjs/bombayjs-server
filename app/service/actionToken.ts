'use strict';

import { Service } from 'egg';
import * as jwt from 'jsonwebtoken';

export default class ActionTokenService extends Service {
  async apply(_id) {
    const { ctx } = this;
    return jwt.sign({
      id: _id,
    }, ctx.app.config.jwt.secret, { expiresIn: ctx.app.config.jwt.expiresIn });
  }
}
