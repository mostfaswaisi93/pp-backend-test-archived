import * as FlakeIdGen from 'flake-idgen';
import * as intformat  from 'biguint-format';

export default class IdGenerator {
  private static _instance;
  private generator = new FlakeIdGen;
  constructor() {

  }

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  generateId(){
       return intformat(this.generator.next(), 'dec');
  }


}