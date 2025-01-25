import { Context, Next } from 'koa';
import { verifyToken } from '../utils/jwt.util';

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
