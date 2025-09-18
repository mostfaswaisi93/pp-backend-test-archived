import * as express from "express";
import { Request, Response } from "express";
import { RoleService } from "./role-service";
import AuthService from "../auth/auth-service";
import Controller from "../../interfaces/controller.interface";
import { create, getRole, update, updateStatus } from "./role-validation";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";

export default class RoleController implements Controller {
  public path = "/roles";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private roleService: RoleService = RoleService.Instance;

  private static _instance: RoleController;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const { authenticate, checkRole } = AuthService.Instance;
    const superadminOnly = [authenticate, checkRole("SUPERADMIN")];
    this.router.post("/create", superadminOnly, create, this.createRole);
    this.router.get(
      "/getRoleById/:_id",
      superadminOnly,
      getRole,
      this.getRoleById
    );
    this.router.get("/", superadminOnly, this.getRoles);
    this.router.put("/update/:_id", superadminOnly, update, this.updateRole);
    this.router.put(
      "/updateRoleStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateRoleStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getRole,
      this.deleteRole
    );

    this.router.put("/restore/:_id", superadminOnly, getRole, this.restoreRole);

    this.router.get("/hierarchy/:_id", superadminOnly, this.getRoleHierarchy);
    this.router.get("/hierarchy", superadminOnly, this.getRolesWithHierarchy);

    this.router.post("/assign", superadminOnly, this.assignRoleToUser);
    this.router.post("/remove", superadminOnly, this.removeRoleFromUser);
    this.router.get("/assignable", superadminOnly, this.getAssignableRoles);
  }

  public createRole = async (request: Request, response: Response) => {
    try {
      const role = await this.roleService.create(request.body);
      const message = "Role created successfully.";
      return this.httpResWrapper.success(response, message, role);
    } catch (error: any) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getRoleById = async (request: Request, response: Response) => {
    try {
      const role = await this.roleService.getRoleById(request.params._id);
      const message = "Role retrieved successfully by ID.";
      return this.httpResWrapper.success(response, message, role);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getRoles = async (request: Request, response: Response) => {
    try {
      const { status, level, fields } = request.query;
      const roles = await this.roleService.getRoles(
        status as string,
        level as string,
        fields as string
      );
      const message = "Roles retrieved successfully";
      return this.httpResWrapper.success(response, message, roles);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateRole = async (request: Request, response: Response) => {
    try {
      const role = await this.roleService.update(
        request.params._id,
        request.body
      );
      const message = "Role successfully updated.";
      return this.httpResWrapper.success(response, message, role);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateRoleStatus = async (request: Request, response: Response) => {
    try {
      const role = await this.roleService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Role status successfully updated.";
      return this.httpResWrapper.success(response, message, role);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteRole = async (request: Request, response: Response) => {
    try {
      await this.roleService.delete(request.params._id);
      const message = "Role successfully deleted.";
      return this.httpResWrapper.success(response, message);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public restoreRole = async (request: Request, response: Response) => {
    try {
      const role = await this.roleService.restore(request.params._id);
      const message = "Role successfully restored.";
      return this.httpResWrapper.success(response, message, role);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getRoleHierarchy = async (request: Request, response: Response) => {
    try {
      const roleId = request.params._id;
      const roleHierarchy = await this.roleService.getRoleHierarchy(roleId);
      const message = "Role hierarchy retrieved successfully.";

      return this.httpResWrapper.success(response, message, roleHierarchy);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getRolesWithHierarchy = async (
    request: Request,
    response: Response
  ) => {
    try {
      const rolesWithHierarchy = await this.roleService.getRolesWithHierarchy();
      const message = "All roles with hierarchy retrieved successfully.";

      return this.httpResWrapper.success(response, message, rolesWithHierarchy);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public assignRoleToUser = async (request: Request, response: Response) => {
    try {
      const assignerUserId = (request as any).user?._id;
      const { userId, roleId } = request.body;

      if (!userId || !roleId) {
        return this.httpResWrapper.error(
          response,
          new Error("UserId and roleId are required")
        );
      }

      await this.roleService.assignRoleToUser(assignerUserId, userId, roleId);
      const message = "Role assigned to user successfully.";

      return this.httpResWrapper.success(response, message, null);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public removeRoleFromUser = async (request: Request, response: Response) => {
    try {
      const assignerUserId = (request as any).user?._id;
      const { userId, roleId } = request.body;

      if (!userId || !roleId) {
        return this.httpResWrapper.error(
          response,
          new Error("UserId and roleId are required")
        );
      }

      await this.roleService.removeRoleFromUser(assignerUserId, userId, roleId);
      const message = "Role removed from user successfully.";

      return this.httpResWrapper.success(response, message, null);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getAssignableRoles = async (request: Request, response: Response) => {
    try {
      const assignerUserId = (request as any).user?._id;
      const assignableRoles =
        await this.roleService.getAssignableRolesByUser(assignerUserId);
      const message = "Assignable roles retrieved successfully.";

      return this.httpResWrapper.success(response, message, assignableRoles);
    } catch (error: any) {
      return this.httpResWrapper.error(response, error);
    }
  };
}
