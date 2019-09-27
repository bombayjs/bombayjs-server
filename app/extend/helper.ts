module.exports = {
  /**
   * 将字符串首字母转成大写
   * @param param0  需要转换的字符串
   * @param lowerRest false 首字母大写，其他不变   true 首字母大写，其他都小写
   */
  capitalize([first, ...rest]:any, lowerRest:boolean = false){
   return  first.toUpperCase() + (lowerRest ? rest.join('').toLowerCase() : rest.join(''));
  },
  success(){
    this.ctx.body = ''
    this.ctx.status = 200;
  }
};

