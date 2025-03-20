import { ObjectId, PushOperator } from 'mongodb';
import { albumsGateway, artistsGateway, musicGateway } from '../database';
import { uploadFile } from './aws.service';

export async function uploadMusic(params: {
  title: string;
  artist_id: string;
  album_id: string;
  path: string;
}): Promise<{ status: 'success' } | { status: 'error'; message: string }> {
  const { title, artist_id, album_id, path } = params;
  if (
    (await artistsGateway.findOne({
      query: { _id: new ObjectId(artist_id) },
    })) === null
  ) {
    return { status: 'error', message: 'Artist not found' };
  }

  if (
    (await albumsGateway.findOne({
      query: { _id: new ObjectId(album_id) },
    })) === null
  ) {
    return { status: 'error', message: 'Album not found' };
  }

  const music = await uploadFile(path, title);

  if (!music) {
    return { status: 'error', message: 'Music not uploaded' };
  }

  const insertedMusic = await musicGateway.insertOne({
    record: { title, artist_id, album_id, path: music },
  });

  if (!insertedMusic) {
    return { status: 'error', message: 'Music not inserted' };
  }

  const updateDetails: PushOperator<Document> = {
    music_list: insertedMusic,
  };

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

  return { status: 'success' };
}
