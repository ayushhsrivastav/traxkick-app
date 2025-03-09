import { Context } from 'koa';
import { generateToken, verifyToken } from '../utils/jwt.util';

export async function getRefreshToken(ctx: Context) {
  const refreshToken = ctx.cookies.get('refresh_token');

  if (!refreshToken) {
    ctx.status = 401;
    ctx.body = {
      status: 'failed',
      message: 'Authentication failed',
    };
    return;
  }

  try {
    const payload = verifyToken(refreshToken, true);
    const newAccessToken = generateToken(payload?.username);

    ctx.cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });

    ctx.body = {
      message: 'Token refreshed',
    };
  } catch {
    ctx.status = 403;
    ctx.body = {
      status: 'failed',
      message: 'Invalid or expired refresh token',
    };
  }
}
