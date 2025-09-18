import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../models/user/user.model";
import { Role } from "../models/role/role.model";
import { RoleLevel } from "../models/role/role.interface";
import { Permission } from "../models/permission/permission.model";
import { roleStructure, permissionsMap } from "../config/role-permission";
import {
  MenuType,
  AccessLevel,
  PermissionAction,
} from "../models/permission/permission.interface";
import { Status } from "../commons/constants/constants";

function capitalizeWords(text: string) {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function runRolePermissionSeeder() {
  await truncateCollections();
  console.log("🟢 Clearing Users, Roles, and Permissions collections");

  for (const [roleName, modules] of Object.entries(roleStructure)) {
    // const role = await createRole(roleName);
    // if (!role) {
    //   console.error(`⚠️ Failed to create role: ${roleName}`);
    //   continue;
    // }
    // for (const [module, permissions] of Object.entries(modules)) {
    //   const permissionIds = await createPermissions(module, permissions);
    //   await role.updateOne({
    //     $addToSet: { permissions: { $each: permissionIds } },
    //   });
    //   console.log(`Created permissions for role: ${roleName}`);
    // }
    //
    // const user = await createUser(roleName, role);
    // await user.updateOne({
    //   $push: { roles: role._id, permissions: role.permissions },
    // });
    //
    // Insert Only Roles
    // await createRole(roleName);
    //
    // Insert Only Permissions
    // for (const [roleName, modules] of Object.entries(roleStructure)) {
    //   for (const [module, permissions] of Object.entries(modules)) {
    //     const permissionIds = await createPermissions(module, permissions);
    //     console.log(
    //       `Created permissions for role: ${roleName}, module: ${module}`
    //     );
    //   }
    // }
    //
    // Insert Only Users
    // const roles = await Role.find({});
    // const userPromises: any[] = [];
    // for (const role of roles) {
    //   userPromises.push(createUser(role.name, role));
    // }
    // await Promise.all(userPromises);
  }
}

async function truncateCollections() {
  await Promise.all([
    // await User.deleteMany({}),
    // await Role.deleteMany({}),
    // await Permission.deleteMany({}),
  ]);
}

async function createRole(roleName: string) {
  if (!roleName || typeof roleName !== "string" || roleName.trim() === "") {
    console.error("⚠️ Role name cannot be null, empty, or invalid.");
    return null;
  }

  const formattedRoleName = roleName.replace(/_/g, " ").trim();
  const upperRoleName = formattedRoleName.toUpperCase();

  const roleHierarchy: Record<string, string | null> = {
    SUPERADMIN: null,
    PRO: "SUPERADMIN",
    STAFF: "PRO",
    CUSTOMER: "PRO",
    VANCUSTOMER: "PRO",
  };

  let roleLevel: RoleLevel;
  switch (upperRoleName) {
    case "SUPERADMIN":
      roleLevel = RoleLevel.SUPERADMIN;
      break;
    case "PRO":
      roleLevel = RoleLevel.PRO;
      break;
    case "STAFF":
      roleLevel = RoleLevel.STAFF;
      break;
    case "CUSTOMER":
      roleLevel = RoleLevel.CUSTOMER;
      break;
    case "VANCUSTOMER":
      roleLevel = RoleLevel.VANCUSTOMER;
      break;
    default:
      console.warn(
        `⚠️ Unknown role name: ${upperRoleName}, defaulting to CUSTOMER`
      );
      roleLevel = RoleLevel.CUSTOMER;
  }

  let parentRoleId: mongoose.Types.ObjectId | null = null;
  const parentRoleName = roleHierarchy[upperRoleName];
  if (parentRoleName) {
    const parentRole = await Role.findOne({ name: parentRoleName });
    if (parentRole) parentRoleId = parentRole._id;
  }

  const role = new Role({
    name: upperRoleName,
    code: roleLevel,
    description:
      upperRoleName === "VANCUSTOMER"
        ? "Van Customer"
        : capitalizeWords(formattedRoleName.toLowerCase()),
    permissions: [],
    parentRole: parentRoleId,
    childRoles: [],
    level: roleLevel,
    isAdmin: upperRoleName === "SUPERADMIN" ? true : false,
    isSystemRole: upperRoleName === "SUPERADMIN" ? true : false,
    status: Status.ACTIVE,
  });

  await role.save();

  if (parentRoleId) {
    await Role.findByIdAndUpdate(parentRoleId, {
      $addToSet: { childRoles: role._id },
    });
  }
  return role;
}

async function createPermissions(module: string, permissions: string) {
  const permissionIds: any[] = [];

  for (const perm of permissions.split(",")) {
    const permissionKey = perm as keyof typeof permissionsMap;

    const permissionData = {
      name: `${permissionsMap[permissionKey]}_${module}`.toLowerCase(),
      displayName: capitalizeWords(
        `${permissionsMap[permissionKey]} ${module}`
      ),
      description: capitalizeWords(
        `${permissionsMap[permissionKey]} ${module}`
      ),
      action:
        PermissionAction[
          permissionsMap[
            permissionKey
          ].toUpperCase() as keyof typeof PermissionAction
        ],
      screenId: `${module}s/${permissionsMap[permissionKey]}`.toLowerCase(),
      isActive: true,
      deletedAt: null,
      menuType:
        permissionsMap[permissionKey].toLowerCase() === "manage"
          ? MenuType.MAIN_MENU
          : MenuType.SUB_MENU,
      accessLevel: AccessLevel.ADMIN,
      isSystemPermission: false,
    };

    const permission = await Permission.findOneAndUpdate(
      { name: permissionData.name },
      { $set: permissionData },
      { upsert: true, new: true }
    );

    if (!permissionIds.includes(permission._id)) {
      permissionIds.push(permission._id);
    }
  }

  return permissionIds;
}

async function createUser(roleName: string, role: any) {
  const email = `${roleName.toLowerCase()}@peakproz.com`;
  const plainPassword = "P@ssw0rd";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const formattedRoleName = roleName.replace(/_/g, " ").trim();

  const user = await User.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        firstName: formattedRoleName,
        lastName: formattedRoleName,
        phoneNumber: "0000000000",
        email,
        password: hashedPassword,
        firebaseUID: "",
        deviceId: "",
        proEmail: null,
        proId: "",
        emailVerificationCode: null,
        mobileVerificationCode: null,
        vanlynk: null,
        leadgen: null,
        companyName: null,
        companyLogo: null,
        isUserRegComplete: false,
        isLeadRegComplete: false,
        isVanlynkRegComplete: false,
        isVerified: false,
        isEmailVerified: false,
        isMobileVerified: false,
        status: Status.ACTIVE,
        isDeleted: false,
        isDeactivated: false,
      },
      $addToSet: {
        roles: role._id,
        // permissions: { $each: role.permissions || [] },
      },
    },
    { upsert: true, new: true }
  );

  return user;
}
