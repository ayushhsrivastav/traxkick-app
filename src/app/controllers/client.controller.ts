import { Context } from 'koa';

export async function fetchDetails(ctx: Context) {
  ctx.status = 200;
  ctx.body = {
    status: 'success',
  };
}
