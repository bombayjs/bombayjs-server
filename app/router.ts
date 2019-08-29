import { Application } from 'egg';

export default (app: Application) => {
  require('./router/admin')(app);
  require('./router/api/web')(app);
  require('./router/api/wx')(app);
};
