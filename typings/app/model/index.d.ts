// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportIpLibrary from '../../../app/model/ip_library';
import ExportProject from '../../../app/model/project';
import ExportUser from '../../../app/model/user';
import ExportWebWebError from '../../../app/model/web/web_error';
import ExportWebWebReport from '../../../app/model/web/web_report';
import ExportWebWebResource from '../../../app/model/web/web_resource';

declare module 'egg' {
  interface IModel {
    IpLibrary: ReturnType<typeof ExportIpLibrary>;
    Project: ReturnType<typeof ExportProject>;
    User: ReturnType<typeof ExportUser>;
    Web: {
      WebError: ReturnType<typeof ExportWebWebError>;
      WebReport: ReturnType<typeof ExportWebWebReport>;
      WebResource: ReturnType<typeof ExportWebWebResource>;
    }
  }
}
