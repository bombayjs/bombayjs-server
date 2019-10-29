import { Subscription } from 'egg';

/**
 * 定时任务查找es中没有地理位置的数据并补上地理信息
 */
class UpdateLocation extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '3s', // 1 分钟间隔
      type: 'worker', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const isExist = await this.app.elasticsearch.indices.exists({
      index: 'frontend-event-log-web-report-collect-*',
    });
    if (!isExist) return ;
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
    if (res.hits.hits.length === 0) return;
    const { _index, _type, _id, _source } = res.hits.hits[0];
    const mapData = await this.app.curl(this.app.config.mapApi, {
      dataType: 'json',
      method: 'GET',
      contentType: 'json',
      dataAsQueryString: true,
      data: {
        ip: _source.ip,
        key: this.app.config.mapKey,
      },
    });
    const { lat, lng } = mapData.data.result.location;
    mapData.data.result.location = {
      lat,
      lon: lng,
    };
    console.dir(mapData.data.result);
    const { status, result }: { status: number, result: {ad_info: { nation: string }, location: object}} = mapData.data;
    if (status === 0) {
      await this.app.elasticsearch.index({
        id: _id,
        index: _index,
        type: _type,
        body: { ..._source, ...result },
      });
      const ipl = this.ctx.helper.subIp(_source.ip);
      const isLocationExist = await this.app.elasticsearch.indices.exists({
        index: 'frontend-event-log-web-report-location',
      });
      if (isLocationExist) {
        const local = await this.app.elasticsearch.search({
          index: 'frontend-event-log-web-report-location',
          type: '_doc',
          body: {
            query: {
              match: {
                ip: ipl,
              },
            },
          },
        });
        if (local.hits.hits.length > 0) return;
      }
      await this.app.elasticsearch.index({
        index: 'frontend-event-log-web-report-location',
        type: '_doc',
        body: Object.assign({}, result, { ip: ipl }),
      });
    }
  }
}

module.exports = UpdateLocation;
