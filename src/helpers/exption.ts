export class HttpException extends Error {
  status: number;
  customCode: string;
  // details: any[];
  constructor(exception: any, message?: string, details?: any[]) {
    super(message || exception.message);
    this.customCode = exception.customCode;
    this.status = exception.status;
    // this.details = details;
  }
}

export class ValidationError extends Error {
  status: number;
  customCode: string;
  constructor(errors: any) {
    let errorsMessages: string = "";
    errors = errors.array();
    for (var i = 0; i < errors.length; i++) {
      errorsMessages += errors[i].msg + " \n ";
    }
    super(errorsMessages);
    this.customCode = "VE400";
    this.status = 400;
  }
}
