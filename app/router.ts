import { Application } from 'egg';

export default (app: Application) => {
  require('./router/api')(app);
  require('./router/web')(app);
  require('./router/wx')(app);
};
