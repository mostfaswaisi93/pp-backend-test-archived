
import * as redis from 'redis';
import * as os from 'os';
import { Logger } from './logger';
import { config } from '../../../config';


export class RedisClient {

  private logger = new Logger().log();
  private redisClientList = [];
  private static _instance;

  constructor() {
    config.redisConfig.forEach(options => {
      this.redisClientList.push(this.createRedisClientObject(options));
    });
  }

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }
  

  createRedisClientObject = (options) => {

    options.retry_strategy = function (options) {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        // End reconnecting on a specific error and flush all commands with a individual error
        new Logger().log().error('main redis client error: ' + options.error);
        // TODO Notify Admins
        // notifier.notifyAdmins('Urgent! Redis server is down. #' + options.error.code);
        return new Error('The server refused the connection');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnecting after a specific timeout and flush all commands with a individual error
        return new Error('Retry time exhausted');
      }
      if (options.attempt > 30) {
        // End reconnecting with built in error
        return undefined;
      }
      // reconnect after
      return (3000);
    }

    const client = redis.createClient(options);

    client.on('connect', () => {
      this.logger.info('main redis client is connected');
    });

    client.on('ready', () => {
      this.logger.info('main redis client is ready');
    });

    client.on('reconnecting', () => {
      this.logger.warn('main redis client is reconnecting');
    });

    client.on('end', (err) => {
      this.logger.info('main redis client ended!');
    });

    client.on('error', (err) => {
      this.logger.error('main redis client error: ', err);
      throw new Error(err.message);
    });

    return client;
  };


  broadcast(methodName, ...args) {
    this.redisClientList.forEach(redisClient => {
      redisClient[methodName](...args);
    });
  }

  receive(methodName, ...args) {
    const _redisClient = this.redisClientList.find(redisClient => this.isLocalHost(redisClient.options.host));
    return _redisClient[methodName](...args);
  }

  isLocalHost(address) {
    let ifaces = os.networkInterfaces();
    let flag = false;
    Object.keys(ifaces).forEach(function (ifname) {
      ifaces[ifname].forEach(function (iface) {
        if (iface.address === address)
          flag = true;
      });
    });
    return flag;
  }



}