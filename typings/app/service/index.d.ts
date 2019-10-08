// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportActionToken from '../../../app/service/actionToken';
import ExportEventVariate from '../../../app/service/eventVariate';
import ExportProject from '../../../app/service/project';
import ExportUser from '../../../app/service/user';
import ExportWebBase from '../../../app/service/web/base';
import ExportWebError from '../../../app/service/web/error';
import ExportWebReport from '../../../app/service/web/report';
import ExportWebRetcode from '../../../app/service/web/retcode';

declare module 'egg' {
  interface IService {
    actionToken: ExportActionToken;
    eventVariate: ExportEventVariate;
    project: ExportProject;
    user: ExportUser;
    web: {
      base: ExportWebBase;
      error: ExportWebError;
      report: ExportWebReport;
      retcode: ExportWebRetcode;
    }
  }
}
