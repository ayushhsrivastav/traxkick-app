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
  PASSWORD_NOT_PASSED: {
    message: 'Password was not passed',
    code: 105,
  },
  CREATED_AT_NOT_PASSED: {
    message: 'Created at not passes',
    code: 106,
  },
  MIN_LEN_PASSWORD: {
    message: 'Minimum length for password is 6 characters',
    code: 107,
  },
  INVALID_TOKEN: {
    message: 'Invalid token provided',
    code: 108,
  },
};

export type ErrorKeys = keyof typeof error_codes;
