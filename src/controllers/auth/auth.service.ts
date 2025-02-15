import { User } from "../../models/users/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../../models/users/user.interface";

export class AuthService {
  static async register(userData: IUser) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new User({ ...userData, password: hashedPassword });
    await newUser.save();
    return newUser;
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    return token;
  }
}
