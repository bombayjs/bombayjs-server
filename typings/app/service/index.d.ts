// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportActionToken from '../../../app/service/actionToken';
import ExportProject from '../../../app/service/project';
import ExportUser from '../../../app/service/user';
import ExportWebError from '../../../app/service/web/error';
import ExportWebReport from '../../../app/service/web/report';

declare module 'egg' {
  interface IService {
    actionToken: ExportActionToken;
    project: ExportProject;
    user: ExportUser;
    web: {
      error: ExportWebError;
      report: ExportWebReport;
    }
  }
}
