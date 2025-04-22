import { Context } from 'koa';
import * as uploadService from '../services/upload.service';

export async function uploadMusic(ctx: Context) {
  const { name, lead_artist_ids, featured_artist_ids, album_id, image_url } =
    ctx.request.body;
  const music = ctx.request.files?.file;

  if (!music) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'No file uploaded' };
    return;
  }

  if (!name) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Title not provided in body' };
    return;
  }

  if (!lead_artist_ids) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Artist ID not provided in body' };
    return;
  }

  if (!image_url) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Image url not provided in body' };
    return;
  }

  const uploadedFile = Array.isArray(music) ? music[0] : music;
  const filePath = uploadedFile.filepath;

  const result = await uploadService.uploadSongDetails({
    name,
    lead_artist_ids,
    featured_artist_ids,
    album_id,
    image_url,
    path: filePath,
  });

  if (result.status === 'success') {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      message: 'Music uploaded successfully',
      song_id: result.song_id,
    };
  } else {
    ctx.status = 400;
    ctx.body = { status: 'error', message: result.message };
  }
}

export async function editMusic(ctx: Context) {
  const {
    _id,
    name,
    lead_artist_ids,
    featured_artist_ids,
    album_id,
    image_url,
  } = ctx.request.body;
  const music = ctx.request.files?.file;

  if (!_id) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: '_id not provieded in body' };
  }

  if (!name) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Title not provided in body' };
    return;
  }

  if (!lead_artist_ids) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Artist ID not provided in body' };
    return;
  }

  if (!image_url) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Image url not provided in body' };
    return;
  }

  let uploadedFile = null;
  let filePath = null;
  if (music) {
    uploadedFile = Array.isArray(music) ? music[0] : music;
    filePath = uploadedFile.filepath;
  }

  const result = await uploadService.editSongDetails({
    _id,
    name,
    lead_artist_ids,
    featured_artist_ids,
    album_id,
    image_url,
    path: filePath,
  });

  if (result.status === 'success') {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      message: 'Music updated successfully',
    };
  } else {
    ctx.status = 400;
    ctx.body = { status: 'error', message: result.message };
  }
}

export async function insertArtist(ctx: Context) {
  const { name, image_url } = ctx.request.body;

  if (!name) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Name not provided in body' };
    return;
  }

  if (!image_url) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Image URL not provided in body' };
    return;
  }

  const result = await uploadService.uploadArtistDetails({
    name,
    image_url,
  });

  if (result.status === 'success') {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      message: 'Artist inserted successfully',
      artist_id: result.artist_id,
    };
  } else {
    ctx.status = 400;
    ctx.body = { status: 'error', message: result.message };
  }
}

export async function editArtist(ctx: Context) {
  const { _id, name, image_url } = ctx.request.body;

  if (!_id) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: '_id not provided in body' };
    return;
  }

  if (!name) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Name not provided in body' };
    return;
  }

  if (!image_url) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Image URL not provided in body' };
    return;
  }

  const result = await uploadService.editArtistDetails({
    _id,
    name,
    image_url,
  });

  if (result.status === 'success') {
    ctx.status = 200;
    ctx.body = { status: 'success', message: 'Artist updated successfully' };
  } else {
    ctx.status = 400;
    ctx.body = { status: 'error', message: result.message };
  }
}

export async function insertAlbum(ctx: Context) {
  const { name, image_url, year, artist_id, copyright } = ctx.request.body;

  if (!name) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Name not provided in body' };
    return;
  }

  if (!image_url) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Image URL not provided in body' };
    return;
  }

  if (!year) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Year not provided in body' };
    return;
  }

  if (!artist_id) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Artist ID not provided in body' };
    return;
  }

  const result = await uploadService.uploadAlbumDetails({
    name,
    image_url,
    year,
    artist_id,
    copyright,
  });

  if (result.status === 'success') {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      message: 'Album inserted successfully',
      album_id: result.album_id,
    };
  } else {
    ctx.status = 400;
    ctx.body = { status: 'error', message: result.message };
  }
}

export async function editAlbum(ctx: Context) {
  const { _id, name, image_url, year, artist_id, copyright } = ctx.request.body;

  if (!_id) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: '_id not provided in body' };
    return;
  }

  if (!name) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Name not provided in body' };
    return;
  }

  if (!image_url) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Image URL not provided in body' };
    return;
  }

  if (!year) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Year not provided in body' };
    return;
  }

  if (!artist_id) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: 'Artist ID not provided in body' };
    return;
  }

  const result = await uploadService.editAlbumDetails({
    _id,
    name,
    image_url,
    year,
    artist_id,
    copyright,
  });

  if (result.status === 'success') {
    ctx.status = 200;
    ctx.body = { status: 'success', message: 'Album updated successfully' };
  } else {
    ctx.status = 400;
    ctx.body = { status: 'error', message: result.message };
  }
}
