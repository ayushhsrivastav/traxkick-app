import { Context } from 'koa';
import { getInfo } from '../services/info.service';

export async function getDetails(ctx: Context) {
  const details = await getInfo();

  ctx.status = 200;
  ctx.body = details;
  return;
}
