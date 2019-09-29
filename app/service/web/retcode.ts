import { Service, Context } from 'egg';

class RetCodeService extends Service {
  constructor(ctx: Context) {
    super(ctx);
  }
  async list(payload) {
    const { start, end, query, token, currentPage, pageSize } = payload;
    const { ctx } = this;
    // let res = [];
    // let total = 0;
    // console.dir(query)
    const filterParams = ctx.helper.decode(query);
    console.dir(filterParams);
    // if (query) { return null }
    console.dir({ start, end, query, token, currentPage, pageSize });
  }
}

module.exports = RetCodeService;
