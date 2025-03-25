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
  artist_id: string;
  artist_name: string;
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
