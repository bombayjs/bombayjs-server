# bombayjs-server


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