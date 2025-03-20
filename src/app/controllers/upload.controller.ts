import { Context } from 'koa';
import * as uploadService from '../services/upload.service';

export async function uploadMusic(ctx: Context) {
  const { title, artist_id, album_id } = ctx.request.body;
  const music = ctx.request.files?.music;

  if (!music) {
    ctx.status = 400;
    ctx.body = { message: 'No file uploaded' };
    return;
  }

  if (!title) {
    ctx.status = 400;
    ctx.body = { message: 'Title not provided in body' };
    return;
  }

  if (!artist_id) {
    ctx.status = 400;
    ctx.body = { message: 'Artist ID not provided in body' };
    return;
  }

  if (!album_id) {
    ctx.status = 400;
    ctx.body = { message: 'Album ID not provided in body' };
    return;
  }

  const uploadedFile = Array.isArray(music) ? music[0] : music;
  const filePath = uploadedFile.filepath;

  const result = await uploadService.uploadMusic({
    title,
    artist_id,
    album_id,
    path: filePath,
  });

  if (result.status === 'success') {
    ctx.status = 200;
    ctx.body = { message: 'Music uploaded successfully' };
  } else {
    ctx.status = 400;
    ctx.body = { message: result.message };
  }
}
