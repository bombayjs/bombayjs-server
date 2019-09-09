import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1566973855378_2564';

  // add your egg config in here
  config.middleware = [];

  // mongodb 服务
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1:27017/bombayjs',
      options: {
          poolSize: 20,
      },
    },
  };

  // redis配置
  config.redis = {
    client: {
        port: 6379, // Redis port
        host: '127.0.0.1', // Redis host
        password: '',
        db: 0,
    },
  };

  config.security = {
    domainWhiteList: [ 'http://127.0.0.1:18090' ],
    csrf: {
        enable: false,
        ignore: '/api/v1/report/**',
    },
  };

  config.cors = {
    credentials: true,
    origin: 'http://localhost:8000',
    allowMethods: 'GET,PUT,POST,DELETE,OPTIONS',
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    origin: [ 'http://127.0.0.1:7002', 'http://localhost:7002', 'http://localhost:8000', 'http://127.0.0.1:8000' ],
    user_pwd_salt_addition: 'BOMBAYJSUSERSALT',
    user_login_timeout: 86400, // 用户登录态持续时间 1 天
    redis_consumption: {
      // 定时任务执行时间
      task_time: '*/20 * * * * *',
      // 每次定时任务消费线程数(web端)
      thread_web: 100,
      // 每次定时任务消费线程数(wx端)
      thread_wx: 100,
      // 消息队列池限制数, 0：不限制 number: 限制条数，高并发时服务优雅降级方案
      total_limit_web: 10000,
      total_limit_wx: 10000,
    },
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
