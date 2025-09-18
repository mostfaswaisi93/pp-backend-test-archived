import bcrypt from "bcrypt";
import User from "../../src/models/user/user.model";

export async function createTestUser(): Promise<any> {
  const email = "superadmin1@peakproz.com";
  const plainPassword = "P@ssw0rd";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  await User.deleteOne({ email });

  const user = await User.create({
    email,
    password: hashedPassword,
    firstName: "SUPERADMIN",
    lastName: "SUPERADMIN",
    phoneNumber: "0000000000",
    status: "ACTIVE",
    roles: [],
    permissions: [],
    deviceId: "device123",
    firebaseUID: "firebase123",
  });

  return { user, plainPassword };
}

export async function removeTestUser(): Promise<void> {
  await User.deleteOne({ email: "superadmin1@peakproz.com" });
}
