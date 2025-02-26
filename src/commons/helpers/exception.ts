export class HttpException extends Error {
  status: number; // HTTP status code
  customCode: string; // Custom error code
  details?: any[]; // Additional details (optional)

  // Constructor to initialize the exception
  constructor(exception: any, message?: string, details?: any[]) {
    super(message || exception.message); // Pass the message to the Error constructor
    this.customCode = exception.customCode;
    this.status = exception.status;
    this.details = details || [];
  }
}

// Custom validation error class that extends HttpException
export class ValidationError extends HttpException {
  constructor(errors: any) {
    const errorMessages = errors
      .array()
      .map((error: { msg: string }) => error.msg)
      .join(" \n ");
    super(
      { message: errorMessages, status: 400, customCode: "VE400" },
      errorMessages
    );
  }
}
