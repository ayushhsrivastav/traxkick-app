import { Context } from 'koa';
import {
  getInfo,
  getHomeInfo,
  getAlbumDetails,
  getMusicUrl,
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

export async function musicUrl(ctx: Context) {
  const songId = ctx.params.id;
  const musicUrl = await getMusicUrl(songId);
  ctx.status = 200;
  ctx.body = {
    url: musicUrl?.url,
    image_url: musicUrl?.image,
    name: musicUrl?.name,
    artist: musicUrl?.artist,
  };
  return;
}
