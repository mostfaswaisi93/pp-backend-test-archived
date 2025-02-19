// Password strengths
export const enum PasswordCheckStrength {
  Short, // Password is too short
  Common, // Password matches common patterns
  Weak, // Password is weak
  Ok, // Password is decent but not strong enough
  Strong, // Password is strong
}

// Object to check password strengths and various properties
export class PasswordCheckService {
  private static _instance: PasswordCheckService;

  private readonly commonPasswordPatterns: RegExp =
    /passw.*|12345.*|09876.*|qwert.*|asdfg.*|zxcvb.*|footb.*|baseb.*|drago.*/;

  // Singleton instance getter
  static get Instance(): PasswordCheckService {
    return this._instance ? this._instance : (this._instance = new this());
  }

  // Expected minimum length for passwords
  public static get MinimumLength(): number {
    return 6;
  }

  // Expected maximum length for passwords
  public static get MaximumLength(): number {
    return 20;
  }

  public isPasswordCommon(password: string): boolean {
    return this.commonPasswordPatterns.test(password);
  }

  public checkPasswordStrength(password: string): PasswordCheckStrength {
    if (!password || password.length < PasswordCheckService.MinimumLength) {
      return PasswordCheckStrength.Short;
    }

    let numberOfElements = this.countPasswordElements(password);

    if (this.isPasswordCommon(password)) {
      return PasswordCheckStrength.Common;
    } else if (numberOfElements < 2) {
      return PasswordCheckStrength.Weak;
    } else if (numberOfElements === 3) {
      return PasswordCheckStrength.Ok;
    } else {
      return PasswordCheckStrength.Strong;
    }
  }

  public checkPasswordValidity(password: string): boolean {
    const numberOfElements = this.countPasswordElements(password);

    return (
      numberOfElements === 4 &&
      password.length >= PasswordCheckService.MinimumLength &&
      password.length <= PasswordCheckService.MaximumLength
    );
  }

  private countPasswordElements(password: string): number {
    let numberOfElements = 0;

    numberOfElements += /.*[a-z].*/.test(password) ? 1 : 0; // Lowercase letters
    numberOfElements += /.*[A-Z].*/.test(password) ? 1 : 0; // Uppercase letters
    numberOfElements += /.*[0-9].*/.test(password) ? 1 : 0; // Numbers
    numberOfElements += /[^a-zA-Z0-9]/.test(password) ? 1 : 0; // Special characters (inc. space)

    return numberOfElements;
  }
}
