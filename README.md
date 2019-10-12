# BOMBAYJS-SERVER

此项目是bombayjs后台服务端

采用eggjs + mongodb + redis + kafka + elk架构

bombayjs是前端监控解决方案，包括bombayjs、bombayjs-server、bombayjs-admin三个项目

项目地址：

* https://github.com/bombayjs/bombayjs (web sdk)
* https://github.com/bombayjs/bombayjs-server (服务端，用于提供api)
* https://github.com/bombayjs/bombayjs-admin （后台管理系统，可视化数据等）

## QuickStart

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7002/
```

Don't tsc compile at development mode, if you had run `tsc` then you need to `npm run clean` before `npm run dev`.

### Deploy

```bash
$ npm run tsc
$ npm start
```

### Npm Scripts

- Use `npm run lint` to check code style
- Use `npm test` to run unit test
- se `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js 8.x
- Typescript 2.8+

### 功能列表

**管理功能**

* 登录注册
* 应用管理
* 用户管理(邀请体系) 角色：管理员 运营 开发
* 报警预警


**web api**
* 上报
* pvuv
* error
* 性能
* 用户轨迹
* 


**wx api**



### kafka -- mac
安装
brew install kafka
启动zookeeper
zookeeper-server-start /usr/local/etc/kafka/zookeeper.properties 
启动kafka
kafka-server-start /usr/local/etc/kafka/server.properties 

### elasticsearch  Kibana
安装：
  https://www.elastic.co/guide/cn/elasticsearch/guide/cn/running-elasticsearch.html
启动 
  ./bin/elasticsearch
  ./bin/kibana