import FlakeIdGen from "flake-idgen";
import intformat from "biguint-format";

export default class IdGenerator {
  private static _instance: IdGenerator | null = null;
  private generator: FlakeIdGen;

  private constructor() {
    this.generator = new FlakeIdGen();
  }

  public static get Instance(): IdGenerator {
    return this._instance ?? (this._instance = new IdGenerator());
  }

  public generateId(): string {
    return intformat(this.generator.next(), "dec");
  }
}
