import { Subscription } from 'egg';

class UpdateLocation extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '1s', // 1 分钟间隔
      type: 'worker', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const res = await this.app.elasticsearch.search({
      index: 'frontend-event-log-web-report-collect-*',
      type: '_doc',
      body: {
        size: 1,
        query: {
          bool: {
            must_not: {
              exists: {
                field: 'ad_info.nation',
              },
            },
          },
        },
      },
    });
    // const { _index, _type, _id, _source } = res.hits.hits[0];
    // await this.app.elasticsearch.index({
    //   id: _id,
    //   index: _index,
    //   type: _type,
    //   body: _source,
    // });
    console.dir(res.hits.hits);
  }
}

module.exports = UpdateLocation;
