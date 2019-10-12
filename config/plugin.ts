// tslint:disable-next-line:no-var-requires
const path = require('path');
import { EggPlugin } from 'egg';

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
};

export default plugin;
