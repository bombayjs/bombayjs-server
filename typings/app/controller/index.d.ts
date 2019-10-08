// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportEventVariate from '../../../app/controller/eventVariate';
import ExportProject from '../../../app/controller/project';
import ExportUser from '../../../app/controller/user';
import ExportWebError from '../../../app/controller/web/error';
import ExportWebIndex from '../../../app/controller/web/index';
import ExportWebReport from '../../../app/controller/web/report';
import ExportWebRetcode from '../../../app/controller/web/retcode';
import ExportWxIndex from '../../../app/controller/wx/index';

declare module 'egg' {
  interface IController {
    eventVariate: ExportEventVariate;
    project: ExportProject;
    user: ExportUser;
    web: {
      error: ExportWebError;
      index: ExportWebIndex;
      report: ExportWebReport;
      retcode: ExportWebRetcode;
    }
    wx: {
      index: ExportWxIndex;
    }
  }
}
