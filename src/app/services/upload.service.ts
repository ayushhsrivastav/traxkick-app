import { ObjectId, PullOperator, PushOperator } from 'mongodb';
import { albumsGateway, artistsGateway, musicGateway } from '../database';
import { uploadFile } from './aws.service';
import { isValidImageUrl } from './generic.service';

export async function uploadSongDetails(params: {
  name: string;
  artist_id: string;
  album_id: string | null;
  image_url: string;
  path: string;
}): Promise<
  { status: 'success'; song_id: string } | { status: 'error'; message: string }
> {
  const { name, artist_id, album_id, image_url, path } = params;

  if (
    (await artistsGateway.findOne({
      query: { _id: new ObjectId(artist_id) },
    })) === null
  ) {
    return { status: 'error', message: 'Artist not found' };
  }

  if (!isValidImageUrl(image_url)) {
    return { status: 'error', message: 'Invalid image URL' };
  }

  if (
    album_id &&
    (await albumsGateway.findOne({
      query: { _id: new ObjectId(album_id) },
    })) === null
  ) {
    return { status: 'error', message: 'Album not found' };
  }

  const music = await uploadFile(path, name.split(' ').join('_').toLowerCase());

  if (!music) {
    return { status: 'error', message: 'Music not uploaded' };
  }

  const insertObject: Record<string, unknown> = {
    name,
    artist_id: new ObjectId(artist_id),
    path: music,
    image_url,
    created_at: new Date(),
    updated_at: new Date(),
  };

  if (album_id) insertObject.album_id = new ObjectId(album_id);

  const insertedMusic = await musicGateway.insertOne({
    record: insertObject,
  });

  if (!insertedMusic) {
    return { status: 'error', message: 'Music not inserted' };
  }

  const updateDetails: PushOperator<Document> = {
    song_list: insertedMusic,
  };

  if (album_id)
    await albumsGateway.findOneAndUpdate({
      query: { _id: new ObjectId(album_id) },
      update: { $push: updateDetails },
      options: { returnDocument: 'after' },
    });

  await artistsGateway.findOneAndUpdate({
    query: { _id: new ObjectId(artist_id) },
    update: { $push: updateDetails },
    options: { returnDocument: 'after' },
  });

  return { status: 'success', song_id: insertedMusic?.toString() };
}

export async function editSongDetails(params: {
  _id: string;
  name: string;
  artist_id: string;
  album_id: string | null;
  image_url: string;
  path: string | null;
}): Promise<{ status: 'success' } | { status: 'error'; message: string }> {
  const { _id, name, artist_id, album_id, image_url, path } = params;

  const currentSongsDetails = await musicGateway.findOne({
    query: { _id: new ObjectId(_id) },
  });

  if (
    currentSongsDetails?.artist_id &&
    currentSongsDetails?.artist_id?.toString() !== artist_id
  ) {
    const dataToPull = {
      song_list: new ObjectId(_id),
    } as PullOperator<Document>;

    await artistsGateway.findOneAndUpdate({
      query: { _id: currentSongsDetails?.artist_id },
      update: { $pull: dataToPull },
      options: { returnDocument: 'after' },
    });
  }

  if (
    currentSongsDetails?.album_id &&
    currentSongsDetails.album_id.toString() !== album_id
  ) {
    const dataToPull = {
      song_list: new ObjectId(currentSongsDetails.album_id),
    } as PullOperator<Document>;

    await albumsGateway.findOneAndUpdate({
      query: { _id: currentSongsDetails.album_id },
      update: { $pull: dataToPull },
      options: { returnDocument: 'after' },
    });
  }

  if (
    (await artistsGateway.findOne({
      query: { _id: new ObjectId(artist_id) },
    })) === null
  ) {
    return { status: 'error', message: 'Artist not found' };
  }

  if (!isValidImageUrl(image_url)) {
    return { status: 'error', message: 'Invalid image URL' };
  }

  if (
    album_id &&
    (await albumsGateway.findOne({
      query: { _id: new ObjectId(album_id) },
    })) === null
  ) {
    return { status: 'error', message: 'Album not found' };
  }

  let music = null;
  if (path)
    music = await uploadFile(path, name.split(' ').join('_').toLowerCase());

  if (!music) {
    return { status: 'error', message: 'Music not uploaded' };
  }

  const updateDetailsMusic: Record<string, unknown> = {
    name,
    artist_id: new ObjectId(artist_id),
    image_url,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const unsetDetails: Record<string, unknown> = {};

  if (album_id) updateDetailsMusic.album_id = new ObjectId(album_id);
  else unsetDetails.album_id = '';

  if (music) updateDetailsMusic.path = music;

  const insertedMusic = await musicGateway.findOneAndUpdate({
    query: { _id: new ObjectId(_id) },
    update: { $set: updateDetailsMusic, $unset: unsetDetails },
    options: { returnDocument: 'after' },
  });

  if (!insertedMusic) {
    return { status: 'error', message: 'Music not inserted' };
  }

  const updateDetails: PushOperator<Document> = {
    song_list: insertedMusic,
  };

  if (album_id)
    await albumsGateway.findOneAndUpdate({
      query: { _id: new ObjectId(album_id) },
      update: { $push: updateDetails },
      options: { returnDocument: 'after' },
    });

  if (currentSongsDetails?.artist_id !== artist_id)
    await artistsGateway.findOneAndUpdate({
      query: { _id: new ObjectId(artist_id) },
      update: { $push: updateDetails },
      options: { returnDocument: 'after' },
    });

  return { status: 'success' };
}

export async function uploadArtistDetails(params: {
  name: string;
  image_url: string;
}): Promise<
  | { status: 'success'; artist_id: string }
  | { status: 'error'; artist_id?: string; message: string }
> {
  const { name, image_url } = params;

  try {
    if (!isValidImageUrl(image_url)) {
      return { status: 'error', message: 'Invalid image URL' };
    }

    const artist = await artistsGateway.insertOne({
      record: {
        name,
        image_url,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return {
      status: artist ? 'success' : 'error',
      message: 'Failed to insert artist details',
      artist_id: artist?.toString() || '',
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error?.message : 'Something went wrong',
    };
  }
}

export async function editArtistDetails(params: {
  _id: string;
  name: string;
  image_url: string;
}): Promise<{ status: 'success' } | { status: 'error'; message: string }> {
  const { _id, name, image_url } = params;

  try {
    if (!isValidImageUrl(image_url)) {
      return { status: 'error', message: 'Invalid image URL' };
    }

    const updatedArtist = await artistsGateway.findOneAndUpdate({
      query: { _id: new ObjectId(_id) },
      update: { $set: { name, image_url, updated_at: new Date() } },
      options: { returnDocument: 'after' },
    });

    if (!updatedArtist) {
      return { status: 'error', message: 'Artist not updated' };
    }

    return { status: 'success' };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error?.message : 'Something went wrong',
    };
  }
}

export async function uploadAlbumDetails(params: {
  name: string;
  image_url: string;
  year: number;
  artist_id: string;
  copyright: string;
}): Promise<
  | { status: 'success'; album_id?: string }
  | { status: 'error'; message: string }
> {
  const { name, image_url, year, artist_id, copyright } = params;

  try {
    if (!isValidImageUrl(image_url)) {
      return { status: 'error', message: 'Invalid image URL' };
    }

    let insertDetails: Record<string, unknown> = {
      name,
      image_url,
      year,
      artist_id: new ObjectId(artist_id),
      created_at: new Date(),
      updated_at: new Date(),
    };
    if (copyright) {
      insertDetails = { ...insertDetails, copyright };
    }

    const album = await albumsGateway.insertOne({
      record: insertDetails,
    });

    if (!album) {
      return { status: 'error', message: 'Album not inserted' };
    }

    return { status: 'success', album_id: album.toString() };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error?.message : 'Something went wrong',
    };
  }
}

export async function editAlbumDetails(params: {
  _id: string;
  name: string;
  image_url: string;
  year: number;
  artist_id: string;
  copyright: string;
}): Promise<{ status: 'success' } | { status: 'error'; message: string }> {
  const { _id, name, image_url, year, artist_id, copyright } = params;

  try {
    if (!isValidImageUrl(image_url)) {
      return { status: 'error', message: 'Invalid image URL' };
    }

    const updatedAlbum = await albumsGateway.findOneAndUpdate({
      query: { _id: new ObjectId(_id) },
      update: {
        $set: {
          name,
          image_url,
          year,
          artist_id: new ObjectId(artist_id),
          copyright,
          updated_at: new Date(),
        },
      },
      options: { returnDocument: 'after' },
    });

    if (!updatedAlbum) {
      return { status: 'error', message: 'Album not updated' };
    }

    return { status: 'success' };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error?.message : 'Something went wrong',
    };
  }
}
