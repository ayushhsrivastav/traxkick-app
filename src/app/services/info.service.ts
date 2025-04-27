import { ObjectId } from 'mongodb';
import { albumsGateway, artistsGateway, musicGateway } from '../database';
import { getSignedUrlForAudio } from './aws.service';

export async function getInfo() {
  const singerDetails = await artistsGateway.find({
    query: {},
    projection: {
      _id: 1,
      name: 1,
      image_url: 1,
    },
  });

  const albumDetails = await albumsGateway.find({
    query: {},
    projection: {
      _id: 1,
      name: 1,
      image_url: 1,
      year: 1,
      artist_id: 1,
      copyright: 1,
    },
  });

  const songDetails = await musicGateway.find({
    query: {},
    projection: {
      _id: 1,
      name: 1,
      image_url: 1,
      artist_ids: 1,
      album_id: 1,
    },
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
        $sample: { size: 4 },
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

  const songs = await musicGateway.aggregate({
    pipleline: [
      { $sort: { updated_at: -1 } },
      { $sample: { size: 5 } },
      {
        $lookup: {
          from: 'side_stream_artists',
          localField: 'artist_ids',
          foreignField: '_id',
          as: 'artists',
        },
      },
      {
        $lookup: {
          from: 'side_stream_artists',
          localField: 'featured_artist_ids',
          foreignField: '_id',
          as: 'featured_artists',
        },
      },
      {
        $lookup: {
          from: 'side_stream_albums',
          localField: 'album_id',
          foreignField: '_id',
          as: 'album',
        },
      },
      { $unwind: '$album' },
      {
        $project: {
          name: 1,
          image_url: 1,
          album_name: '$album.name',
          artists: 1,
          featured_artists: 1,
        },
      },
    ],
  });

  const formattedSongs = songs.map(song => {
    const artistNames = song.artists
      .map((a: { name: string }) => a.name)
      .join(', ');
    const featuredNames = song.featured_artists
      .map((a: { name: string }) => a.name)
      .join(', ');
    const artistLine = featuredNames
      ? `${artistNames} ft. ${featuredNames}`
      : artistNames;

    return {
      ...song,
      artist_name: artistLine,
    };
  });

  return { featuredAlbums, trendingSongs: formattedSongs };
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

export async function getMusicUrl(songId: string) {
  const songDetails = (
    await musicGateway.aggregate({
      pipleline: [
        {
          $match: { _id: new ObjectId(songId) },
        },
        {
          $lookup: {
            from: 'side_stream_artists',
            localField: 'artist_ids',
            foreignField: '_id',
            as: 'artists',
          },
        },
        {
          $lookup: {
            from: 'side_stream_artists',
            localField: 'featured_artist_ids',
            foreignField: '_id',
            as: 'featured_artists',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            image_url: 1,
            path: 1,
            artists: 1,
            featured_artists: 1,
          },
        },
      ],
    })
  )[0];

  const artistNames = songDetails?.artists
    .map((a: { name: string }) => a.name)
    .join(', ');
  const featuredNames = songDetails?.featured_artists
    .map((a: { name: string }) => a.name)
    .join(', ');

  if (songDetails?.path) {
    return {
      _id: songDetails._id,
      url: await getSignedUrlForAudio(songDetails.path),
      image: songDetails.image_url,
      name: songDetails.name,
      artist: featuredNames
        ? `${artistNames} ft. ${featuredNames}`
        : artistNames,
    };
  }

  return null;
}
