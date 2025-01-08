import { Context, Next } from 'koa';

// Define a type for middleware functions
type KoaMiddleware = (ctx: Context, next: Next) => Promise<void>;

// Enum for HTTP methods
export enum RequestMethod {
  GET = 'get',
  POST = 'post',
}

// Interface for defining individual route configurations
interface RouteConfig {
  method: RequestMethod;
  endpoint: string;
  middlewares?: KoaMiddleware | KoaMiddleware[];
  action: (ctx: Context, next: Next) => Promise<void>;
}

// Interface for grouping routes under a common prefix
interface RouteGroupConfig {
  basePath: string;
  groupMiddlewares?: KoaMiddleware | KoaMiddleware[];
}

// Interface representing a complete routing module
export interface RouteModule {
  groupConfig: RouteGroupConfig;
  routeDefinitions: RouteConfig[];
}
