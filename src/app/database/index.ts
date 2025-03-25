/* eslint-disable prettier/prettier */
import DatabaseGateway from './operations/database-gateway';

export const albumsGateway                  = new DatabaseGateway('side_stream_albums');
export const artistsGateway                 = new DatabaseGateway('side_stream_artists');
export const configurationGateway           = new DatabaseGateway('side_stream_configuration');
export const credentialsGateway             = new DatabaseGateway('side_stream_credentials');
export const errorGateway                   = new DatabaseGateway('side_stream_errors');
export const musicGateway                   = new DatabaseGateway('side_stream_music');
export const usersGateway                   = new DatabaseGateway('side_stream_users')