/* eslint-disable prettier/prettier */
import DatabaseGateway from './operations/database-gateway';

export const albumsGateway                  = new DatabaseGateway('dev_albums');
export const artistsGateway                 = new DatabaseGateway('dev_artists');
export const configurationGateway           = new DatabaseGateway('dev_configuration');
export const credentialsGateway             = new DatabaseGateway('dev_credentials');
export const errorGateway                   = new DatabaseGateway('dev_errors');
export const musicGateway                   = new DatabaseGateway('dev_music');
export const usersGateway                   = new DatabaseGateway('dev_users')