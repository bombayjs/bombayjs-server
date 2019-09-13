import { Service } from 'egg';

export default class ProjectService extends Service {
  ProjectValidate: any;

  constructor(props) {
    super(props);
    this.ProjectValidate = {
      type: { type: 'string', required: true, allowEmpty: false, trim: true, desc: '新增项目信息操作：请选择类型' },
      project_name: { type: 'string', required: true, allowEmpty: false, trim: true, desc: '新增项目信息操作：项目名称不能为空' },
    };
  }
  // 获得项目列表信息
  async list(ctx) {
    const { token, begin, end } = ctx.request.body;
    const result = await ctx.app.models.webErrors(token).aggregate([
      {
        $match: {
          create_time: { $gte: new Date(begin), $lte: new Date(end) },
        },
      },
      {
        $group: {
          _id: {
            file: '$file',
            msg: '$msg',
          },
          count: { $sum: 1 },
        },
      },
    ]).exec();
    return this.app.retResult(result);
  }
}