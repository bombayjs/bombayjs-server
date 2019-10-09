import { Service } from 'egg';

interface Conditions {
  user_id: string;
  project_token: string;
  name?: RegExp;
  is_use?: 0 | 1;
}

export default class EventVariateService extends Service {
  ProjectValidate: any;
  listValidate: any;

  constructor(props) {
    super(props);
    this.ProjectValidate = {
      project_token: { type: 'string', required: true, trim: true, desc: '新增事件操作：请选择项目' },
      name: { type: 'string', required: true, trim: true, desc: '新增事件操作：事件名称不能为空' },
      marker: { type: 'string', required: true, trim: true, desc: '新增事件操作：事件标识符不能为空' },
      type: { type: 'string', required: true, trim: true, desc: '新增事件操作：事件类型不能为空' },
    };

    this.listValidate = {
      project_token: { type: 'string', required: true, trim: true, desc: '新增事件操作：请选择项目' },
    }
  }
  async add() {
    const { ctx } = this;
    const query = ctx.request.body;
    // 参数校验
    ctx.validate(this.ProjectValidate);
    if (ctx.paramErrors) {
      // get error infos from `ctx.paramErrors`;
      return this.app.retError(ctx.paramErrors[0].desc);
    }
    // 检验是否存在
    let search = await ctx.model.EventVariate.findOne({ name: query.name, type: query.type }).exec();
    if (search) return this.app.retError('新增项目信息操作：事件已存在');

    search = await ctx.model.EventVariate.findOne({ marker: query.marker, type: query.type }).exec();
    if (search) return this.app.retError('新增项目信息操作：事件已存在');

    const variate = new ctx.model.EventVariate();
    variate.user_id = [ ctx.currentUserId || '' ];
    variate.project_token = query.project_token;
    variate.name = query.name;
    variate.marker = query.marker;
    variate.type = query.type;
    variate.is_use = query.is_use || 1;

    const result = await variate.save();
    return this.app.retResult(result);
  }

  async set() {
    const { ctx } = this;
    const query = ctx.request.body;

    // 没有_id就是新增
    if (!query._id) {
      return this.add();
    }

    // 参数校验
    ctx.validate(this.ProjectValidate);
    if (ctx.paramErrors) {
      // get error infos from `ctx.paramErrors`;
      return this.app.retError(ctx.paramErrors[0].desc);
    }
    const variate = await ctx.model.EventVariate.findOne({ _id: query._id }).exec();
    if (!variate) return this.app.retError('新增项目信息操作：事件不存在');

    // 检验是否存在
    let search = await ctx.model.EventVariate.findOne({ name: query.name, type: query.type, project_token: query.project_token }).exec();
    if (search && search.id !== variate.id) return this.app.retError('新增项目信息操作：事件已存在1');

    search = await ctx.model.EventVariate.findOne({ marker: query.marker, type: query.type, project_token: query.project_token }).exec();
    if (search && search.id !== variate.id) return this.app.retError('新增项目信息操作：事件已存在2');

    variate.name = query.name;
    variate.marker = query.marker;
    variate.is_use = query.is_use === undefined ? 1 : query.is_use;

    const result = await variate.save();
    return this.app.retResult(result);
  }

  async list() {
    const { ctx } = this;
    const query = ctx.request.body;
    // 参数校验
    ctx.validate(this.listValidate);
    if (ctx.paramErrors) {
      // get error infos from `ctx.paramErrors`;
      return this.app.retError(ctx.paramErrors[0].desc);
    }
    const conditions: Conditions = {
      user_id: ctx.currentUserId ,
      project_token: query.project_token,
    };

    if (query.name) conditions.name = new RegExp(`.*${query.name}.*`);
    if (query.is_use === 0 || query.is_use === 1) conditions.is_use = query.is_use;

    const result = await ctx.model.EventVariate
      .find(conditions)
      .exec() || [];

    return this.app.retResult(result);
  }
}
