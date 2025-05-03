import { Permission } from "../models/permission/permission.model";
import { Role } from "../models/role/role.model";
import User from "../models/user/user.model";
import { roleStructure, permissionsMap } from "../config/role-permission";
import bcrypt from "bcrypt";

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
    //   userPromises.push(createUser(role.roleName, role));
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

  const role = new Role({
    name: formattedRoleName,
    code: formattedRoleName,
    description: formattedRoleName,
    isAdmin: false,
    permissions: [],
    status: "ACTIVE",
  });

  await role.save();
  return role;
}

async function createPermissions(module: string, permissions: string) {
  const permissionIds: any[] = [];

  for (const perm of permissions.split(",")) {
    const permissionKey = perm as keyof typeof permissionsMap;
    const permissionName = `${permissionsMap[permissionKey]}_${module}`;

    const permissionData = {
      name: permissionName,
      screenId: module,
      ACCESS: true,
      MENU_TYPE: "main-menu",
      ACCESS_LEVEL: "ADMIN",
      displayName: `${permissionsMap[permissionKey]} ${module}`,
      description: `${permissionsMap[permissionKey]} ${module}`,
    };

    const permission = await Permission.findOneAndUpdate(
      { name: permissionName },
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
  const email = `${roleName}@peakproz.com`;
  const plainPassword = "P@ssw0rd";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const formattedRoleName = roleName.replace(/_/g, " ").trim();
  const phoneNumber = "0000000000";
  const isUserRegComplete = false;
  const isLeadRegComplete = false;
  const isVanlynkRegComplete = false;

  const permissions = role.permissions || [];

  const user = await User.findOneAndUpdate(
    { email: email },
    {
      $setOnInsert: {
        firstName: formattedRoleName,
        lastName: formattedRoleName,
        phoneNumber: phoneNumber,
        email: email,
        password: hashedPassword,
        isUserRegComplete: isUserRegComplete,
        isLeadRegComplete: isLeadRegComplete,
        isVanlynkRegComplete: isVanlynkRegComplete,
      },
      $addToSet: {
        roles: role._id,
        permissions: { $each: permissions },
      },
    },
    { upsert: true, new: true }
  );

  return user;
}
