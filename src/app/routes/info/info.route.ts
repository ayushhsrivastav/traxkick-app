import {
  albumDetails,
  getDetails,
  homeInfo,
  musicUrl,
} from '../../controllers/info.controller';
import { authentication } from '../../middlewares';
import { RequestMethod, RouteModule } from '../route.interface';

const routeModule: RouteModule = {
  groupConfig: {
    basePath: '/info',
    groupMiddlewares: [authentication],
  },
  routeDefinitions: [
    {
      method: RequestMethod.GET,
      endpoint: '/get-details',
      action: getDetails,
    },
    {
      method: RequestMethod.GET,
      endpoint: '/home-info',
      action: homeInfo,
    },
    {
      method: RequestMethod.GET,
      endpoint: '/album/:id',
      action: albumDetails,
    },
    {
      method: RequestMethod.GET,
      endpoint: '/music/:id',
      action: musicUrl,
    },
  ],
};

export default routeModule;
