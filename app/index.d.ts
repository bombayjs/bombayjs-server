declare module 'egg' {
  // extend app
  type MongooseModel = {
    [key: string]: (key?:any)=> mongoose.Model<any>
  };
  interface Application {
    models: MongooseModel;
    retError:(errorMsg?: string, errorCode?: number, data?: {})=> void;
    randomString:(len?:number)=> void;
    retResult:(data: any, msg?: string, code?: number)=> void;
    
  }

  interface Context {
    models: MongooseModel;
    retError:(errorMsg?: string, errorCode?: number, data?: {})=> void;
    randomString:(len?:number)=> void;
    retResult:(data: any, msg?: string, code?: number)=> void;
  }

  // extend your config
  interface EggAppConfig {
    models: MongooseModel;
    retError?:(errorMsg?: string, errorCode?: number, data?: {})=> void;
    randomString:(len?:number)=> void;
    retResult:(data: any, msg?: string, code?: number)=> void;
  }

}