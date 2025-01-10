// Package import
import jwt from 'jsonwebtoken';

// Dependencies
import config from '../../config/config';

export async function generateToken(
  user_id: string,
  is_refresh_token: boolean = false
) {
  if (is_refresh_token)
    return jwt.sign({ user_id }, config.jwt.refreshTokenSecret);

  return jwt.sign({ user_id }, config.jwt.accessTokenSecret, {
    expiresIn: '15m',
  });
}

export async function verifyToken(
  token: string,
  is_refresh_token: boolean = false
) {
  try {
    let payload;
    if (is_refresh_token)
      payload = jwt.verify(token, config.jwt.refreshTokenSecret);
    else payload = jwt.verify(token, config.jwt.accessTokenSecret);

    return { status: 'success', payload };
  } catch (error) {
    return { status: 'failed', error };
  }
}
