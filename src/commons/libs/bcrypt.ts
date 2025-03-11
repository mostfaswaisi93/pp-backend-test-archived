import bcrypt from "bcrypt";

const passwordEncryption = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject(err);
      else resolve(hash);
    });
  });
};

const passwordComparision = async (
  enteredPassword: string,
  servicePassword: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(enteredPassword, servicePassword, (err, same) => {
      if (err) reject(err);
      else resolve(same);
    });
  });
};

export { passwordEncryption, passwordComparision };
