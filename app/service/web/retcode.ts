import { Service, Context } from 'egg';

// tslint:disable-next-line:no-var-requires
const moment = require('moment');

class RetCodeService extends Service {
  constructor(ctx: Context) {
    super(ctx);
  }
  /**
   * ************************************************************************************************
   * 获取维度聚合数据
   * @param payload
   * ************************************************************************************************
   */
  public async dimension(payload) {
    const { filters, dimensions, startTime, endTime, order, measures } = payload;
    const filterParams = this.filterParams(filters);
    const aggsQuery = this.aggsDimensionQuery(dimensions, order, measures);
    const body = {
      size: 0,
      query: {
        bool: {
          must: filterParams,
          filter: {
            range: {
              '@timestamp': {
                gte: moment(startTime),
                lte: moment(endTime),
              },
            },
          },
        },
      },
      aggs: aggsQuery,
    };
    const res = await this.esSearch(body);
    return this.dimensionRes(res, dimensions, measures);
  }
  /**
   * ************************************************************************************************
   * 获取指标聚合数据
   * @param payload
   * ************************************************************************************************
   */
  async indicator(payload) {
    const { filters, startTime, endTime, intervalMillis, measures } = payload;
    const filterParams = this.filterParams(filters);
    const aggsQuery = this.aggsIndicatorQuery(measures, intervalMillis);
    const body = {
      size: 0,
      query: {
        bool: {
          must: filterParams,
          filter: {
            range: {
              '@timestamp': {
                gte: moment(startTime),
                lte: moment(endTime),
              },
            },
          },
        },
      },
      aggs: aggsQuery,
    };
    const res = await this.esSearch(body);
    return this.indicatorRes({ res, payload });
  }
  /**
   * *******************************************************************************************
   * 格式化维度返回数据
   * @param res object es返回结果
   * @param dimensions array 聚合名称
   * @param measures array 筛选参数
   * @returns object  返回结果
   * *******************************************************************************************
   */
  public dimensionRes(res, dimensions, measures) {
    let total: number = 0;                                                      // 返回结果总和
    const data: any[] = [];                                                  // 查询数据
    const name = dimensions[0];
    if (!res.aggregations || res.aggregations[name].buckets.length === 0) return { data: [], total: 0 };
    res.aggregations[name].buckets.map(b => {
      const temp: {pv?: number; uv?: number} = {};
      temp[name] = b.key;
      measures.map(item => {
        if (b[item].buckets) {
          if (item === 'count') temp[item] = b.doc_count;
          else temp[item] = b[item].buckets;
        } else {
          temp[item] = b[item].value || 0;
          if (item === 'count') temp[item] = b.doc_count;
        }
      });
      data.push(temp);
      total += b.doc_count;
    });
    return { data, total, };
  }
  /**
   * *******************************************************************************************
   * 格式化指标返回数据
   * @param res object es返回结果
   * @param measures array 筛选参数
   * @returns object  返回结果
   * *******************************************************************************************
   */
  public indicatorRes(params) {
    const { payload: { measures, startTime, endTime, intervalMillis }, res } = params;
    let total: number = 0;                                                      // 返回结果总和
    const data: any[] = [];                                                  // 查询数据
    if (!res.aggregations || res.aggregations.indicator.buckets.length === 0) return { data: [], total: 0 };
    console.dir(res.aggregations.indicator.buckets);
    res.aggregations.indicator.buckets.map(b => {
      const temp: {pv?: number; uv?: number; date?: number; format?: string} = {};
      temp.date = b.key;
      temp.format = b.key_as_string;
      measures.map(item => {
        if (b[item].buckets) {
          if (item === 'count') temp[item] = b.doc_count;
          else temp[item] = b[item].buckets;
        } else {
          temp[item] = b[item].value || 0;
        }
      });
      data.push(temp);
      total += b.doc_count;
    });
    const leftArray: object[] = [];
    const rightArray: object[] = [];
    // 左补全
    console.dir(data);
    if (data[0].date > startTime) {
      const diff: any = (data[0].date - startTime) / intervalMillis;
      const fillData: any = {};
      measures.map(item => {
        fillData[item] = 0;
      });
      Array(Number.parseInt(diff)).fill(1).map((_item, index) => {
        console.dir(index);
        const currentDate = data[0].date + index * intervalMillis;
        const formatDate = moment(currentDate).format('YYYY-MM-DD hh:mm:ss');
        fillData.date = currentDate;
        fillData.format = formatDate;
        leftArray.push(fillData);
      });
    }
    // 右补全
    if (data[data.length - 1].date < endTime) {
      const diff: any = (endTime - data[data.length - 1].date) / intervalMillis;
      const fillData: any = {};
      measures.map(item => {
        fillData[item] = 0;
      });
      Array(Number.parseInt(diff)).fill(1).map((_item, index) => {
        const currentDate = data[data.length - 1].date + index * intervalMillis;
        const formatDate = moment(currentDate).format('YYYY-MM-DD hh:mm:ss');
        fillData.date = currentDate;
        fillData.format = formatDate;
        rightArray.push(fillData);
      });
    }
    const allData = [ ...leftArray, ...data, ...rightArray ];
    return { allData, total, };
  }
  /**
   * *******************************************************************************************
   * @param body object es查询参数
   * @returns object  es查询结果
   * *******************************************************************************************
   */
  public async esSearch(body) {
    return await this.app.elasticsearch.search({
      index: 'frontend-event-log-web-report-collect-*',
      type: '_doc',
      body,
    });
  }
  /**
   * *******************************************************************************************
   * @param filters array 过滤参数
   * @returns  object es过滤参数
   * *******************************************************************************************
   */
  public filterParams(filters) {
    let filterQuery: any[] = [];                                                // 筛选过滤参数对象
    Object.keys(filters).map(item => {                                          // 拼装es过滤参数
      const match = {};
      match[`${item}`] = filters[`${item}`];
      filterQuery = [ ...filterQuery, { match }];
    });
    return filterQuery;
  }
  /**
   * *******************************************************************************************
   * @param dimensions array 聚合名称
   * @param order string 聚合排序参数
   * @returns query objet es过滤参数
   * 注： 目前只取一个参数
   * *******************************************************************************************
   */
  public aggsDimensionQuery(dimensions, order, measures) {
    const aggsQuery: {pv?: any } = {};
    const name = dimensions[0];
    const aggs: { pv?: any, uv?: any } = {};
    measures.map(item => {
      if (item === 'pv' || item === 'uv') {
        if (item === 'pv') {
          aggs.pv = {sum: {
            field: 'pv',
          }};
        } else {
          aggs.uv = {cardinality: {
            field: 'ip.keyword',
          }};
        }
      } else {
        if (item.includes('_')) {
          const values = item.split('_');
          aggs[item] = {
            [values[0]] : {
              field: `${values[1]}`,
            },
          };
        } else {
          aggs[item] = {
            terms: {
              field: `${item}.keyword`,
            },
          };
        }
      }
    });
    aggsQuery[name] = {
      terms: {
        field: `${name}.keyword`,
        order: {
          _count: order.toLowerCase(),
        },
      },
      aggs,
    };
    return aggsQuery;
  }
  /**
   * *******************************************************************************************
   * @param dimensions array 聚合名称
   * @param order string 聚合排序参数
   * @returns query objet es过滤参数
   * 注： 目前只取一个参数
   * *******************************************************************************************
   */
  public aggsIndicatorQuery(measures, intervalMillis) {
    const aggs: { pv?: any, uv?: any } = {};
    measures.map(item => {
      if (item === 'pv' || item === 'uv') {
        if (item === 'pv') {
          aggs.pv = {sum: {
            field: 'pv',
          }};
        } else {
          aggs.uv = {cardinality: {
            field: 'ip.keyword',
          }};
        }
      } else {
        if (item.includes('_')) {
          const values = item.split('_');
          aggs[item] = {
            [values[0]] : {
              field: `${values[1]}`,
            },
          };
        } else {
          aggs[item] = {
            terms: {
              field: `${item}.keyword`,
            },
          };
        }
      }
    });
    const aggsQuery = {
      indicator: {
        date_histogram : {
          field : '@timestamp',
          interval: intervalMillis,
          format: 'yyyy-MM-dd hh:mm:ss',
          min_doc_count : 0,
        },
        aggs,
      },
    };
    return aggsQuery;
  }
}

module.exports = RetCodeService;
