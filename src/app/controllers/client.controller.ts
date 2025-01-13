import { Context } from 'koa';
import * as clientService from '../services/client.service';

/**
 *
 * @param ctx Koa Context with all meta data
 * @description To login a user and provided the access and refresh token
 */
export async function login(ctx: Context) {
  const response = await clientService.login(ctx);
  if (response?.status === 'success') {
    ctx.cookies.set('access_token', response.access_token, {
      httpOnly: true,
      sameSite: 'strict',
    });
    ctx.cookies.set('refresh_token', response.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
    });
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      message: 'Logged in successfully',
    };
  } else {
    ctx.status = 400;
    ctx.body = { status: 'failed' };
  }
}

/**
 *
 * @param ctx Koa Context with all meta data
 * @description To logout user after clearing all cookies
 */
export async function logout(ctx: Context) {
  ctx.cookies.set('access-token', '', { maxAge: 0 });
  ctx.cookies.set('refresh_token', '', { maxAge: 0 });

  ctx.body = {
    status: 'success',
    message: 'Logged out successfully',
  };
}
