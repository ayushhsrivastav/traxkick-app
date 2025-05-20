/* eslint-disable prettier/prettier */
import DatabaseGateway from './operations/database-gateway';

export const albumsGateway                  = new DatabaseGateway('tracxkick_albums');
export const artistsGateway                 = new DatabaseGateway('tracxkick_artists');
export const configurationGateway           = new DatabaseGateway('tracxkick_configuration');
export const errorGateway                   = new DatabaseGateway('tracxkick_errors');
export const musicGateway                   = new DatabaseGateway('tracxkick_music');
export const usersGateway                   = new DatabaseGateway('tracxkick_users')