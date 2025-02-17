import { User } from "../../models/users/user.model";
import { IUser } from "../../models/users/user.interface";

class UserService {
  async createUser(email: string, password: string) {
    const user = new User({
      email,
      password,
    });

    await user.save();
    return user;
  }

  async getAllUsers(): Promise<IUser[]> {
    return User.find();
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  }

  async updateUser(userId: string, email: string, password: string) {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, password },
      { new: true }
    );
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    return User.findByIdAndDelete(userId);
  }
}

export default new UserService();
