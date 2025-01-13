// Package import
import jwt from 'jsonwebtoken';

// Dependencies
import config from '../../config/config';
import { BaseError } from './error.util';

export function generateToken(
  username: string,
  is_refresh_token: boolean = false
) {
  if (is_refresh_token)
    return jwt.sign({ username }, config.jwt.refreshTokenSecret);

  return jwt.sign({ username }, config.jwt.accessTokenSecret, {
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
      'username' in payload
    ) {
      return payload;
    }

    throw new BaseError('INVALID_TOKEN', true);
  } catch {
    throw new BaseError('INVALID_TOKEN', true);
  }
}
