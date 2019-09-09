// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportJwt from '../../../app/middleware/jwt';
import ExportTokenRequired from '../../../app/middleware/token_required';

declare module 'egg' {
  interface IMiddleware {
    jwt: typeof ExportJwt;
    tokenRequired: typeof ExportTokenRequired;
  }
}
