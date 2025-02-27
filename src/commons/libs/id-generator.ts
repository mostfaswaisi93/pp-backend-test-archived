export default class IdGenerator {
  private static _instance: IdGenerator | null = null;

  private constructor() {}

  public static get Instance(): IdGenerator {
    return this._instance ?? (this._instance = new IdGenerator());
  }

  public generateId() {}
}
