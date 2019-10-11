import { Service } from 'egg';

interface Conditions {
  user_id: string;
  project_token: string;
  name?: RegExp;
  is_use?: 0 | 1;
}

export default class PageVariateService extends Service {
  ProjectValidate: any;
  listValidate: any;

  constructor(props) {
    super(props);
    this.ProjectValidate = {
      project_token: { type: 'string', required: true, trim: true, desc: '请选择项目' },
      name: { type: 'string', required: true, trim: true, desc: '页面名称不能为空' },
      path: { type: 'string', required: true, trim: true, desc: '页面标识符不能为空' },
    };

    this.listValidate = {
      project_token: { type: 'string', required: true, trim: true, desc: '请选择项目' },
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
    let search = await ctx.model.PageVariate.findOne({ project_token: query.project_token, name: query.name }).exec();
    if (search) return this.app.retError('页面已存在');

    search = await ctx.model.PageVariate.findOne({ project_token: query.project_token, path: query.path }).exec();
    if (search) return this.app.retError('页面已存在');

    const variate = new ctx.model.PageVariate();
    variate.user_id = [ ctx.currentUserId || '' ];
    variate.project_token = query.project_token;
    variate.name = query.name;
    variate.path = query.path;
    variate.is_use = query.is_use || 1;

    const result = await variate.save();
    return this.app.retResult(result);
  }

  async get() {
    const { ctx } = this;
    const query = ctx.request.body;
    // 参数校验
    ctx.validate(this.listValidate);
    if (ctx.paramErrors) {
      // get error infos from `ctx.paramErrors`;
      return this.app.retError(ctx.paramErrors[0].desc);
    }

    const cond: any = {
      project_token: query.project_token,
    };
    if (query._id) cond._id = query._id;
    if (query.name) cond.name = query.name;
    if (query.path) cond.path = query.path;

    const result = await ctx.model.PageVariate.findOne(query).exec();
    if (!result) return this.app.retError('页面不存在');

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
    const variate = await ctx.model.PageVariate.findOne({ _id: query._id }).exec();
    if (!variate) return this.app.retError('页面不存在');

    // 检验是否存在
    let search = await ctx.model.PageVariate.findOne({ project_token: query.project_token, name: query.name, }).exec();
    if (search && search.id !== variate.id) return this.app.retError('页面已存在');

    search = await ctx.model.PageVariate.findOne({ project_token: query.project_token, path: query.path, }).exec();
    if (search && search.id !== variate.id) return this.app.retError('页面已存在');

    variate.name = query.name;
    variate.path = query.path;
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

    const result = await ctx.model.PageVariate
      .find(conditions)
      .exec() || [];

    return this.app.retResult(result);
  }
}
