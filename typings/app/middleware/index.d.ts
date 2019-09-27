// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportErrorHandler from '../../../app/middleware/error_handler';
import ExportJwt from '../../../app/middleware/jwt';
import ExportReportWeb from '../../../app/middleware/report_web';
import ExportTokenRequired from '../../../app/middleware/token_required';

declare module 'egg' {
  interface IMiddleware {
    errorHandler: typeof ExportErrorHandler;
    jwt: typeof ExportJwt;
    reportWeb: typeof ExportReportWeb;
    tokenRequired: typeof ExportTokenRequired;
  }
}
