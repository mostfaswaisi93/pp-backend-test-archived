import ApplicationException from "./application-exception";

export class BaseException extends ApplicationException {
  public readonly errorCode: string;

  constructor(messageKey: string, status: number, errorCode: string) {
    super(messageKey, status, status);
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
