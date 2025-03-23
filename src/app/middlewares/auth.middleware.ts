import { Context, Next } from 'koa';
import { verifyToken } from '../utils/jwt.util';
import { usersGateway } from '../database';

export const authentication = async (ctx: Context, next: Next) => {
  const token = ctx.cookies.get('access_token');

  if (!token) {
    ctx.status = 401;
    ctx.body = {
      status: 'failed',
      message: 'Authentication failed',
    };
    return;
  }

  try {
    const payload = verifyToken(token);
    ctx.state.user = payload;
    await next();
  } catch {
    ctx.status = 403;
    ctx.body = { status: 'failed', message: 'Invalid token provided' };
  }
};

export const isAdmin = async (ctx: Context, next: Next) => {
  const token = ctx.cookies.get('access_token');

  if (!token) {
    ctx.status = 401;
    ctx.body = { status: 'failed', message: 'Authentication failed' };
    return;
  }

  try {
    const payload = verifyToken(token);
    const userDetails = await usersGateway.findOne({
      query: { username: payload.username },
    });

    if (!userDetails?.is_admin) {
      ctx.status = 402;
      ctx.body = { status: 'failed', message: 'Unauthorized' };
      return;
    }
    await next();
  } catch {
    ctx.status = 403;
    ctx.body = { status: 'failed', message: 'Unauthorized' };
    return;
  }
};

export const isUserAdmin = async (ctx: Context) => {
  const token = ctx.cookies.get('access_token');

  if (!token) {
    return false;
  }

  try {
    const payload = verifyToken(token);
    const userDetails = await usersGateway.findOne({
      query: { username: payload.username },
    });

    if (!userDetails?.is_admin) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};
