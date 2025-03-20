import { Context, Next } from 'koa';
import { verifyToken } from '../utils/jwt.util';
import { credentialsGateway } from '../database';

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

export const credentials = async (ctx: Context, next: Next) => {
  const { access_id, access_key } = ctx.request.headers;

  if (!access_id || !access_key) {
    ctx.status = 401;
    ctx.body = {
      status: 'failed',
      message: 'Access ID or Access Key not found',
    };
    return;
  }

  if (
    (await credentialsGateway.findOne({
      query: { access_id, access_key },
    })) === null
  ) {
    ctx.status = 401;
    ctx.body = { status: 'failed', message: 'Authentication failed' };
    return;
  }

  await next();
};
