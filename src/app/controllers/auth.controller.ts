import { Context } from 'koa';
import { generateToken, verifyToken } from '../utils/jwt.util';
import config from '../../config/config';
import { isUserAdmin } from '../middlewares/auth.middleware';

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
    const newAccessToken = generateToken(payload?.username, payload?.is_admin);

    ctx.cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: config.is_server,
      domain: config.domain,
      path: '/',
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

export async function checkAuth(ctx: Context) {
  const accessToken = ctx.cookies.get('access_token');

  if (!accessToken) {
    ctx.status = 202;
    ctx.body = { authenticated: false };
  } else {
    ctx.status = 200;
    ctx.body = { authenticated: true };
  }
  return;
}

/**
 *
 * @param ctx Koa Context with all meta data
 * @description To check if the user is admin
 */
export async function userRole(ctx: Context) {
  const adminUser = await isUserAdmin(ctx);
  if (adminUser) {
    ctx.status = 200;
    ctx.body = true;
  } else {
    ctx.status = 201;
    ctx.body = false;
  }
}
