import { error_codes, ErrorKeys } from '../../config/error-codes';

export class BaseError extends Error {
  public code: number;
  public error_message: unknown;
  public report_error: boolean;

  constructor(errorKey: ErrorKeys, report_error = false, capture_stack = true) {
    super(error_codes[errorKey].message);
    this.code = error_codes[errorKey].code;
    this.error_message = errorKey;
    this.report_error = report_error;
    if (capture_stack) Error.captureStackTrace(this, this.constructor);
  }
}
