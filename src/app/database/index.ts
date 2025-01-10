/* eslint-disable prettier/prettier */
import DatabaseGateway from './operations/database-gateway';

export const configurationGateway           = new DatabaseGateway('dev_configuration');
export const errorGateway                   = new DatabaseGateway('dev_errors');
export const usersGateway                   = new DatabaseGateway('dev_users')
