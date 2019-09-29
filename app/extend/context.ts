
module.exports = {
  /**
   * 获取 model 实例
   * @param collectionName 集合的名称 示例 web_pv_xxxxxx
   */
  async getModel(collectionName: string) {
    const model = this.model[collectionName] || null;
    const collections = collectionName.split('_');
    const type = `${this.helper.capitalize(collections[0])}${this.helper.capitalize(collections[1])}`;
    if (!model) {
      const module = this.app.models[type];
      const collection = await module(collections[2])();
      this.model[collectionName] = collection.model(collectionName);
      return collection.model(collectionName);
    }
    return model;
  },
  /**
   * 创建 collection 并加到this.ctx.model 中
   * @param modelName model 名称
   * @param suffix 表后缀 目前为token的值
   * @return Model
   */
  async createModel(modelName: string, suffix: string, collectionName: string) {
    const currentModal = await this.getModel(collectionName);
    if (currentModal) {
      return null;
    } else {
      const module = this.app.models[modelName];
      const model = await module(suffix)();
      this.model[collectionName] = model.model(collectionName);
      return null;
    }
  },
};
