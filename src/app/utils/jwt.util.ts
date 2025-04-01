// Package import
import jwt from 'jsonwebtoken';

// Dependencies
import config from '../../config/config';
import { BaseError } from './error.util';

export function generateToken(
  username: string,
  is_admin: boolean = false,
  is_refresh_token: boolean = false
) {
  if (is_refresh_token)
    return jwt.sign({ username, is_admin }, config.jwt.refreshTokenSecret);

  return jwt.sign({ username, is_admin }, config.jwt.accessTokenSecret, {
    expiresIn: '15m',
  });
}

export function verifyToken(token: string, is_refresh_token: boolean = false) {
  try {
    let payload;
    if (is_refresh_token)
      payload = jwt.verify(token, config.jwt.refreshTokenSecret);
    else payload = jwt.verify(token, config.jwt.accessTokenSecret);

    if (
      typeof payload === 'object' &&
      payload !== null &&
      'username' in payload &&
      'is_admin' in payload
    ) {
      return payload;
    }

    throw new BaseError('INVALID_TOKEN', true, true, 'Unknown Error');
  } catch (error) {
    throw new BaseError('INVALID_TOKEN', true, true, error);
  }
}
