
import { Service, Context } from 'egg';
// tslint:disable-next-line:no-var-requires
const moment = require('moment');
// tslint:disable-next-line:no-var-requires
const UUid = require('uuid');

class ReportService extends Service {
  constructor(ctx: Context) {
    super(ctx);
  }
  /**
   * *******************************************************************************************
   * 保存数据到es
   * @param payload 要保存的数据
   * @param event es 对应的_index名称
   * @param id es 对应的_id名称
   * @param timestamp es 时间参数
   * @param eventLog es要保存的数据
   * *******************************************************************************************
   */
  async saveDataToEs(payload) {
    return await this.app.curl(this.app.config.kafkaSubmit, {
        dataType: 'json',
        method: 'POST',
        contentType: 'json',
        data: {
          event: 'web-report-collect',
          id: UUid.v1(),
          timestamp: new Date().getTime(),
          eventLog: payload,
        },
      });
  }
  /**
   * 本地测试使用,发布后删除
   * @param payload
   */
  async save(payload) {
    return await this.app.elasticsearch.index({
      index: `frontend-event-log-web-report-collect-${moment().format('YYYY-MM')}`,
      type: '_doc',
      body: payload,
    });
    // await this.ctx.kafka.sendMessageSync({
    //   topic: 'reportTopic', // 指定 kafka 目录下 的topic
    //   key: 'report', // 指定 kafka 下的 topic 目录 对应key的consumer
    //   messages: JSON.stringify(payload),
    // });
    // , res => {
    //   console.dir('sucess');
    //   console.dir(res);
    // }, error => {
    //   console.dir('error');
    //   console.dir(error);
    // }
  }
}

module.exports = ReportService;
