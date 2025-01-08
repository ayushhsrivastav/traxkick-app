// Dependencies
import Koa from 'koa';
import Router from 'koa-router';

// Import route modules
import ClientRoutes from './client';
import { RouteModule } from './route.interface';

class RouteManager {
  private mainRouter!: Router;

  constructor() {
    this.mainRouter = new Router();
    this.configureRoutes();
    this.handleUnauthorizedAccess();
  }

  public getRouter() {
    return this.mainRouter;
  }

  private configureRoutes() {
    this.registerRoutes(ClientRoutes, '');
  }

  private registerRoutes(routeModules: RouteModule[], rootPath = '') {
    // Create a parent router with an optional root path prefix
    const parentRouter = new Router({ prefix: rootPath });

    // Loop through each route module to configure routes and middlewares
    routeModules.forEach(({ groupConfig, routeDefinitions }) => {
      const { basePath, groupMiddlewares } = groupConfig;
      // Create a nested router for each route group with its own base path
      const nestedRouter = new Router({ prefix: basePath });

      // Loop through route definitions to define individual routes
      routeDefinitions.forEach(({ method, endpoint, middlewares, action }) => {
        let appliedMiddlewares: Koa.Middleware[] = [];

        // If middlewares are provided as an array, apply them
        if (Array.isArray(middlewares)) appliedMiddlewares = [...middlewares];

        // If middlewares is a function, add it to the applied middlewares
        if (typeof middlewares === 'function')
          appliedMiddlewares.push(middlewares);

        // Handle different HTTP methods for each route
        switch (method) {
          case 'get':
            // Register a GET route with its middlewares and action
            nestedRouter.get(endpoint, ...appliedMiddlewares, action);
            break;
          case 'post':
            // Register a POST route with its middlewares and action
            nestedRouter.post(endpoint, ...appliedMiddlewares, action);
            break;
          default:
            // Throw an error for unsupported HTTP methods
            throw new Error(`Unsupported HTTP method: ${method}`);
        }
      });

      // Initialize group-level middlewares
      let groupLevelMiddlewares: Koa.Middleware[] = [];

      // If group middlewares are provided as an array, apply them
      if (Array.isArray(groupMiddlewares))
        groupLevelMiddlewares = [...groupMiddlewares];

      // If group middlewares is a function, add it to the middlewares
      if (typeof groupMiddlewares === 'function')
        groupLevelMiddlewares.push(groupMiddlewares);

      // Apply group-level middlewares to the parent router
      parentRouter.use(...groupLevelMiddlewares);
      // Attach the nested router with its routes to the parent router
      parentRouter.use(nestedRouter.routes());
      // Ensure allowed HTTP methods are handled properly for the nested router
      parentRouter.use(nestedRouter.allowedMethods());
    });

    // Attach the parent router's routes to the main router
    this.mainRouter.use(parentRouter.routes());
    // Ensure allowed HTTP methods are handled properly for the parent router
    this.mainRouter.use(parentRouter.allowedMethods());
  }

  private handleUnauthorizedAccess() {
    this.mainRouter.get('/', ctx => {
      ctx.body = '<h1>Unauthorized Access</h1>';
    });
  }
}

export default new RouteManager();
