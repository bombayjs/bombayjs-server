import { EggPlugin } from 'egg';
const path = require('path');

const plugin: EggPlugin = {
  static: true,
  validate : {
    enable: true,
    package: 'egg-validate',
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  routerPlus: {
    enable: true,
    package: 'egg-router-plus',
  },
  valparams: {
    enable: true,
    package: 'egg-valparams',
  },
  // kafkaNode : {
  //   enable: true,
  //   package: 'egg-kafka-node',
  // },
  elasticsearch : {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-elasticsearch'),
  },
  graphql: {
    enable: true,
    package: '@switchdog/egg-graphql',
  },
};

export default plugin;
