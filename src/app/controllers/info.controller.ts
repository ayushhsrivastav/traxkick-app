import { Context } from 'koa';
import {
  getInfo,
  getHomeInfo,
  getAlbumDetails,
} from '../services/info.service';

export async function getDetails(ctx: Context) {
  const details = await getInfo();

  ctx.status = 200;
  ctx.body = details;
  return;
}

export async function homeInfo(ctx: Context) {
  const homeInfo = await getHomeInfo();

  ctx.status = 200;
  ctx.body = homeInfo;
  return;
}

export async function albumDetails(ctx: Context) {
  const albumId = ctx.params.id;
  const albumDetails = await getAlbumDetails(albumId);

  ctx.status = 200;
  ctx.body = albumDetails;
  return;
}
