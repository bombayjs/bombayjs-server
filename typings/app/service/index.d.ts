// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportProject from '../../../app/service/project';
import ExportUser from '../../../app/service/user';
import ExportWebReport from '../../../app/service/web/report';

declare module 'egg' {
  interface IService {
    project: ExportProject;
    user: ExportUser;
    web: {
      report: ExportWebReport;
    }
  }
}
