import { Service } from 'egg';

const _ =require('lodash');

class ReportService extends Service {

  // 保存用户上报的数据
  async saveWebReportData(ctx) {
    const query = ctx.query;
    const project = await this.service.project.getProjectForToken(query.token);
    if (!project) return {};
    if (project.is_use !== 1) return {};
    const model = ctx.app.models[`web${_.capitalize(query.t)}`];
    if (!model) return {};
    let report = model(query.token)();
    report = Object.assign(report, query);
    report.save();
    return {};
  }

}

module.exports = ReportService;
