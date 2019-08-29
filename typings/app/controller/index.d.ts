// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportApi from '../../../app/controller/api';
import ExportWebIndex from '../../../app/controller/web/index';
import ExportWxIndex from '../../../app/controller/wx/index';

declare module 'egg' {
  interface IController {
    api: ExportApi;
    web: {
      index: ExportWebIndex;
    }
    wx: {
      index: ExportWxIndex;
    }
  }
}
