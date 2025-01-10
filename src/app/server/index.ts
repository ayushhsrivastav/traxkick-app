// Packages import
import koa from 'koa';
import helmet from 'koa-helmet';
import koaRouter from 'koa-router';
import bodyParser from 'koa-bodyparser';

// Dependencies
import database from '../database/connection';
import config from '../../config/config';
import routes from '../routes';
import { handleError } from '../middlewares/error.middleware';

class Server {
  private app: koa;
  private port: number;
  private router: koaRouter;

  constructor() {
    this.app = new koa();
    this.port = config.port;
    this.router = routes.getRouter();
  }

  async start() {
    // Connecting to database
    await database.initializeConnection();

    // Attaching middlewares and routes
    await this.attachMiddleware();

    // Starting the server
    this.listen();
  }

  private async attachMiddleware() {
    // Attach body parser to get request body
    this.app.use(bodyParser());

    // Error middleware
    this.app.use(handleError);

    // Use Helmet to enable the XSS filter to protect against cross-site scripting (XSS) attacks
    this.app.use(helmet.xssFilter());

    // Use Helmet to set Content Security Policy (CSP) for the application
    this.app.use(
      helmet.contentSecurityPolicy({
        directives: {
          // Restrict the default source to only the same origin (self)
          defaultSrc: ["'self'"],

          // Allow styles to be loaded only from the same origin (self)
          styleSrc: ["'self'"],

          // Allow inline scripts, which may be necessary for certain client-side functionality
          scriptSrc: ["'unsafe-inline'"],
        },
      })
    );

    // Attach the Koa router's routes as middleware, allowing for route handling
    this.app.use(this.router.routes());

    // Attach allowed methods middleware for responding with appropriate HTTP methods (e.g., GET, POST)
    this.app.use(this.router.allowedMethods());
  }

  private listen() {
    this.app.listen(this.port, () => {
      console.log(
        `\nSERVER RUNNING AT PORT: ${this.port} in ${config.environment} environment`
      );
    });
  }
}

export default new Server();
