module.exports = options => {
  return async (ctx, next) => {
    const find =  options.match.find(item=>ctx.url.includes(item))
    if(find){
      const { err }:{err: Object} =  JSON.parse(ctx.request.body)||{}
      const ip = ctx.get('X-Real-IP') || ctx.get('X-Forwarded-For') || ctx.ip;
      const url  = ctx.query.url || ctx.headers.referer;
      const user_agent = ctx.headers['user-agent'];
      ctx.query = {...ctx.query, ip, url, user_agent, ...err }
    }
    await next();
    if(find){
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.set('Content-Type', 'application/json;charset=UTF-8');
      ctx.set('X-Response-Time', '2s');
      ctx.set('Connection', 'close');
    }
  }
};


