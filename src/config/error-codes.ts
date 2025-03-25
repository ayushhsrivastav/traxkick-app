export const error_codes = {
  UNKNWON_EXCEPTION: {
    message: 'Unknown exception occured',
    code: 100,
  },
  USER_NOT_EXIST: {
    message: 'User does not exist',
    code: 101,
  },
  PASSWORD_INCORRECT: {
    message: 'Password is incorrect',
    code: 102,
  },
  DETAILS_NOT_FOUND: {
    message: 'Either username or password not passed',
    code: 103,
  },
  USERNAME_NOT_PASSED: {
    message: 'Username was not passed',
    code: 104,
  },
  EMAIL_NOT_PASSED: {
    message: 'Email was not passed',
    code: 105,
  },
  PASSWORD_NOT_PASSED: {
    message: 'Password was not passed',
    code: 106,
  },
  CREATED_AT_NOT_PASSED: {
    message: 'Created at not passes',
    code: 107,
  },
  MIN_LEN_PASSWORD: {
    message: 'Minimum length for password is 6 characters',
    code: 108,
  },
  INVALID_TOKEN: {
    message: 'Invalid token provided',
    code: 109,
  },
  AWS_ERROR: {
    message: 'AWS Error',
    code: 110,
  },
};

export type ErrorKeys = keyof typeof error_codes;
