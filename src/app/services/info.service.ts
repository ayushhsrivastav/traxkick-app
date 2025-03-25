import { ObjectId } from 'mongodb';
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
          from: 'side_stream_artists',
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
          from: 'side_stream_artists',
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
          from: 'side_stream_albums',
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

export async function getHomeInfo() {
  const featuredAlbums = await albumsGateway.aggregate({
    pipleline: [
      {
        $sort: {
          year: -1,
          updated_at: -1,
        },
      },
      {
        $sample: { size: 3 },
      },
      {
        $lookup: {
          from: 'side_stream_artists',
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
        },
      },
    ],
  });

  const trendingSongs = await musicGateway.aggregate({
    pipleline: [
      {
        $sort: {
          updated_at: -1,
        },
      },
      {
        $sample: { size: 5 },
      },
      {
        $lookup: {
          from: 'side_stream_artists',
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
          from: 'side_stream_albums',
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
        },
      },
    ],
  });

  return { featuredAlbums, trendingSongs };
}

export async function getAlbumDetails(albumId: string) {
  const albumDetails = await albumsGateway.aggregate({
    pipleline: [
      {
        $match: { _id: new ObjectId(albumId) },
      },
      {
        $lookup: {
          from: 'side_stream_artists',
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
          from: 'side_stream_music',
          localField: '_id',
          foreignField: 'album_id',
          as: 'songs',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image_url: 1,
          artist_name: '$artist.name',
          year: 1,
          songs: {
            _id: 1,
            name: 1,
            duration: 1,
          },
        },
      },
    ],
  });

  if (Array.isArray(albumDetails) && albumDetails.length > 0) {
    return albumDetails[0];
  }

  return null;
}
