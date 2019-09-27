module.exports = options => {
  return async (ctx, next) => {
    await next();
    const find =  options.match.find(item=>ctx.url.includes(item))
    if(find){
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.set('Content-Type', 'application/json;charset=UTF-8');
      ctx.set('X-Response-Time', '2s');
      ctx.set('Connection', 'close');
    }
  }
};


