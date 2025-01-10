export class BaseError extends Error {
  public code: number;
  public error_message: unknown;
  public report_error: boolean;

  constructor(
    message: string,
    code: number,
    error_message: unknown,
    report_error = false,
    capture_stack = true
  ) {
    super(message);
    this.code = code;
    this.error_message = error_message;
    this.report_error = report_error;
    if (capture_stack) Error.captureStackTrace(this, this.constructor);
  }
}
