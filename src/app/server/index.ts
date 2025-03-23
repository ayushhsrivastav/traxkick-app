// Packages import
import koa from 'koa';
import helmet from 'koa-helmet';
import koaRouter from 'koa-router';
import koaBody from 'koa-body';

// Dependencies
import database from '../database/connection';
import config from '../../config/config';
import routes from '../routes';
import { corsMiddleware, handleError } from '../middlewares';

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
    // Attach CORS middleware
    this.app.use(corsMiddleware);

    // Attach `koa-body` to handle JSON, form-data & file uploads
    this.app.use(
      koaBody({
        multipart: true, // Enable file uploads
        json: true,
        formidable: {
          uploadDir: 'uploads/temp', // Directory for file uploads
          keepExtensions: true, // Keep file extensions
        },
      })
    );

    // Error middleware
    this.app.use(handleError);

    // Use Helmet for security headers
    this.app.use(helmet.xssFilter());
    this.app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'"],
          scriptSrc: ["'unsafe-inline'"],
        },
      })
    );

    // Attach routes
    this.app.use(this.router.routes());
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
