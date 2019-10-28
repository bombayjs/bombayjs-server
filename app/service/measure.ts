import { Service } from 'egg';


export default class PageVariateService extends Service {
  listValidate: any;

  constructor(props) {
    super(props);
    
    this.listValidate = {
      project_token: { type: 'string', required: true, trim: true, desc: '请选择项目' },
    }
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

    const cond: any = {
      project_token: query.project_token,
    };
    const page = ctx.model.PageVariate.find(cond);
    const event = ctx.model.EventVariate.find(cond);
    const [ rPage, rEvent ] = await Promise.all([ page, event ]);
    console.log(rPage, rEvent)
    const rPages = rPage.map(item => {
      return {
        tt: 'page',
        t: 'pv',
        ...item._doc,
      }
    })
    const rEvents = rEvent.map(item => {
      return {
        tt: 'event',
        t: 'behavior',
        ...item._doc,
      }
    })
    const result = [ ...rPages, ...rEvents ];

    return this.app.retResult(result);
  }
}
