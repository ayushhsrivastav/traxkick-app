import { albumsGateway, artistsGateway, musicGateway } from '../database';

export async function getInfo() {
  const singerDetails = await artistsGateway.find({
    query: {},
    projection: {
      _id: 1,
      name: 1,
      image_url: 1,
    },
  });

  const albumDetails = await albumsGateway.aggregate({
    pipleline: [
      {
        $lookup: {
          from: 'dev_artists',
          localField: 'artist_id',
          foreignField: '_id',
          as: 'artist',
        },
      },
      {
        $unwind: '$artist',
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image_url: 1,
          artist_name: '$artist.name',
          year: 1,
          artist_id: 1,
          copyright: 1,
        },
      },
    ],
  });

  const songDetails = await musicGateway.aggregate({
    pipleline: [
      {
        $lookup: {
          from: 'dev_artists',
          localField: 'artist_id',
          foreignField: '_id',
          as: 'artist',
        },
      },
      {
        $unwind: '$artist',
      },
      {
        $lookup: {
          from: 'dev_albums',
          localField: 'album_id',
          foreignField: '_id',
          as: 'album',
        },
      },
      {
        $unwind: '$album',
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image_url: 1,
          artist_name: '$artist.name',
          album_name: '$album.name',
          artist_id: 1,
          album_id: 1,
        },
      },
    ],
  });

  return { singerDetails, albumDetails, songDetails };
}
