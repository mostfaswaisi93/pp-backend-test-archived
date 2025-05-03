import { Role } from "../../models/role/role.model";
import { IRole } from "../../models/role/role.interface";
import { InvalidInputException } from "../../commons/errors/exceptions";

export class RoleService {
  private static _instance: RoleService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  public async create(data: Partial<IRole>) {
    if (data.name) {
      const roleExists = await Role.findOne({ name: data.name });
      if (roleExists) {
        throw new InvalidInputException("Role name already exists");
      }
    }

    const role = new Role({
      name: data.name,
      code: data.code,
      description: data.description,
      permissions: data.permissions || [],
      isAdmin: data.isAdmin || false,
      status: data.status ?? "ACTIVE",
    });

    try {
      return await role.save();
    } catch (error) {
      throw new InvalidInputException("Failed to create role");
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

  public async update(id: string, data: Partial<IRole>) {
    const role = await Role.findById(id);
    if (!role) {
      throw new InvalidInputException("Role not found");
    }

    if (data.name && data.name !== role.name) {
      const existingRole = await Role.findOne({ name: data.name });
      if (existingRole && existingRole._id.toString() !== id) {
        throw new InvalidInputException("Role name already exists");
      }
    }

    role.name = data.name ?? role.name;
    role.code = data.code ?? role.code;
    role.description = data.description ?? role.description;
    role.permissions = data.permissions ?? role.permissions;
    role.isAdmin = data.isAdmin ?? role.isAdmin;
    role.status = data.status ?? role.status;

    try {
      return await role.save();
    } catch (error) {
      throw new InvalidInputException("Failed to update role");
    }
  }

  public async delete(id: string) {
    const role = await Role.findByIdAndDelete(id);
    if (!role) throw new InvalidInputException("Role not found");
  }
}
