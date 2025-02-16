// Password strengths
export const enum PasswordCheckStrength {
    Short,
    Common,
    Weak,
    Ok,
    Strong,
};

// Object to check password strengths and various properties
export class PasswordCheckService {


    private static _instance;

    static get Instance() {
      return this._instance ? this._instance : (this._instance = new this());
    }

    // Expected length of all passwords
    public static get MinimumLength(): number {
        return 6;
    }

    // Expected length of all passwords
    public static get MaximumLength(): number {
        return 20;
    }

    // Regex to check for a common password string - all based on 5+ length passwords
    private commonPasswordPatterns = /passw.*|12345.*|09876.*|qwert.*|asdfg.*|zxcvb.*|footb.*|baseb.*|drago.*/;

    //
    // Checks if the given password matches a set of common password
    //
    public isPasswordCommon(password: string): boolean {
        return this.commonPasswordPatterns.test(password);
    }

    //
    // Returns the strength of the current password
    //
    public checkPasswordStrength(password: string): PasswordCheckStrength {

        // Build up the strenth of our password
        let numberOfElements = 0;
        numberOfElements = /.*[a-z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Lowercase letters
        numberOfElements = /.*[A-Z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Uppercase letters
        numberOfElements = /.*[0-9].*/.test(password) ? ++numberOfElements : numberOfElements;      // Numbers
        numberOfElements = /[^a-zA-Z0-9]/.test(password) ? ++numberOfElements : numberOfElements;   // Special characters (inc. space)

        // Assume we have a poor password already
        let currentPasswordStrength = PasswordCheckStrength.Short;

        // Check then strenth of this password using some simple rules
        if (password === null || password.length < PasswordCheckService.MinimumLength) {
            currentPasswordStrength = PasswordCheckStrength.Short;
        } else if (this.isPasswordCommon(password) === true) {
            currentPasswordStrength = PasswordCheckStrength.Common;
        } else if (numberOfElements === 0 || numberOfElements === 1 || numberOfElements === 2) {
            currentPasswordStrength = PasswordCheckStrength.Weak;
        } else if (numberOfElements === 3) {
            currentPasswordStrength = PasswordCheckStrength.Ok;
        } else {
            currentPasswordStrength = PasswordCheckStrength.Strong;
        }

        // Return the strength of this password
        return currentPasswordStrength;
    }
    

    public checkPasswordValidaty(password: string): Boolean {

        let numberOfElements = 0;
        numberOfElements = /.*[a-z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Lowercase letters
        numberOfElements = /.*[A-Z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Uppercase letters
        numberOfElements = /.*[0-9].*/.test(password) ? ++numberOfElements : numberOfElements;      // Numbers
        numberOfElements = /[^a-zA-Z0-9]/.test(password) ? ++numberOfElements : numberOfElements;   // Special characters (inc. space)

        let isPasswordValid = false;

        if (numberOfElements === 4 && password.length >= PasswordCheckService.MinimumLength && password.length <= PasswordCheckService.MaximumLength) {
            isPasswordValid = true;
        }

        return isPasswordValid;
    }
}