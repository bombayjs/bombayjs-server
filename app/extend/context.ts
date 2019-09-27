module.exports = {
  /**
   * 获取 model 实例
   * @param collectionName 集合的名称
   */
  getModel(collectionName:string){
    return this.model[collectionName]
  },
  /**
   * 创建 collection 并加到this.ctx.model 中
   * @param modelName model 名称
   * @param suffix 表后缀 目前为token的值
   * @return Model
   */
  async createModel(modelName:string, suffix:string, collectionName:string){
    const module = this.app.models[modelName]
    let model = await module(suffix)();
    this.model[collectionName] = model.model(collectionName)
    return model.model(collectionName)
  }
};