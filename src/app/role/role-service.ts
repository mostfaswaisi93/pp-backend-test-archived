import { InvalidInputException } from "../../commons/errors/exceptions";
import { Role } from "../../models/role/role.model";
import { IRole } from "../../models/role/role.interface";

export class RoleService {
  private static _instance: RoleService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  // public async create(roleData: Partial<IRole>) {
  //   const role = new Role(roleData);
  //   return await role.save();
  // }

  // async create(data:any, userId) {
  async create(data: any) {
    if (data.roleName) {
      let roleExist = await Role.findOne({ roleName: data.roleName });
      if (roleExist) {
        throw new InvalidInputException("Role name already exists");
        // throw new InvalidInputException(i18n.__("roleName_already_exist"));
      }
    }
    let role = new Role();
    role.status = data.status === undefined ? "ACTIVE" : data.status;
    role.roleName = data.roleName;
    role.roleCode = data.roleCode;
    role.roleDescription = data.roleDescription;
    // role.updatedBy = userId;
    role.permissions = data.permissions || [];
    role.isAdminFlag = data.isAdminFlag || false;

    try {
      let result = await role.save();
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async getAllRoles() {
    return await Role.find();
  }

  public async getRoleById(id: string) {
    const role = await Role.findById(id);
    if (!role) throw new InvalidInputException("Role not found");
    return role;
  }

  public async update(id: string, roleData: Partial<IRole>) {
    const updatedRole = await Role.findByIdAndUpdate(id, roleData, {
      new: true,
    });
    if (!updatedRole) throw new InvalidInputException("Role not found");
    return updatedRole;
  }

  public async delete(id: string) {
    const role = await Role.findByIdAndDelete(id);
    if (!role) throw new InvalidInputException("Role not found");
  }
}
