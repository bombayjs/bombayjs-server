// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportProject from '../../../app/model/project';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Project: ReturnType<typeof ExportProject>;
    User: ReturnType<typeof ExportUser>;
  }
}
