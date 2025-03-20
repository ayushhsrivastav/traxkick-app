import { Context, Next } from 'koa';
import config from '../../config/config';

export default async function corsMiddleware(ctx: Context, next: Next) {
  ctx.set('Access-Control-Allow-Origin', config.clientUrl);
  ctx.set('Access-Control-Allow-Methods', 'GET, POST');
  ctx.set(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type, Authorization'
  );
  ctx.set('Access-Control-Allow-Credentials', 'true');
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    return;
  }
  await next();
}
