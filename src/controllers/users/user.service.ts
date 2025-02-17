class UserService {
  public async createUser(username: string, password: string): Promise<void> {
    console.log(`New user created: ${username}`);
  }
}

export default new UserService();
