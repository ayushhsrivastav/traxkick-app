import { getDetails } from '../../controllers/info.controller';
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
  ],
};

export default routeModule;
