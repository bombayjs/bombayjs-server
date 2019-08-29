// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTokenRequired from '../../../app/middleware/token_required';

declare module 'egg' {
  interface IMiddleware {
    tokenRequired: typeof ExportTokenRequired;
  }
}
