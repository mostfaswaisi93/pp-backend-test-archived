import { getRepository, Not } from "typeorm";
import { RoleLkp } from "../../database/entity/RoleLkp";


export class UserRoleService {


  private userRoleRepository = getRepository(RoleLkp);

  private static _instance;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  async all(): Promise<RoleLkp[]> {
    let result: RoleLkp[] = await this.userRoleRepository.find({});
    return result;
  }

  async findById(id): Promise<RoleLkp> {
    let chapter: RoleLkp = await this.userRoleRepository.findOne({id});
    return chapter;
  }

}