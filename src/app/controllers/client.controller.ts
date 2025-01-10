import { Context } from 'koa';
import * as clientService from '../services/client.service';

export async function fetchDetails(ctx: Context) {
  ctx.status = 200;
  ctx.body = {
    status: 'success',
  };
}

export async function login(ctx: Context) {
  const response = await clientService.login(ctx);
  if (response?.status === 'success') {
    ctx.status = 200;
    ctx.body = response;
  } else {
    ctx.status = 400;
    ctx.body = { status: 'failed' };
  }
}
