export interface HomeAlbums {
  _id: string;
  name: string;
  image_url: string;
  artist_name: string;
}

export interface HomeSongs {
  _id: string;
  name: string;
  album_name: string;
  image_url: string;
  artist_name: string;
}

export interface Singer {
  _id: string;
  name: string;
  image_url: string;
}

export interface Album {
  _id: string;
  name: string;
  year: number;
  artist_id: string;
  artist_name: string;
  copyright: string;
  image_url: string;
}

export interface Song {
  _id: string;
  name: string;
  image_url: string;
  artist_ids: string[];
  featured_artist_ids: string[];
  artist_names: string[];
  album_id: string;
  album_name: string;
}

export interface AlbumDetails {
  _id: string;
  name: string;
  year: number;
  artist_id: string;
  artist_name: string;
  copyright: string;
  image_url: string;
  songs: {
    _id: string;
    name: string;
    duration: number;
  }[];
}

export interface SongDetails {
  _id: string;
  queue_id: string;
  name: string;
  image_url: string;
  url: string;
  artist: string;
}
