import { login } from '../../controllers/client.controller';
import { RequestMethod, RouteModule } from '../route.interface';

const routeModule: RouteModule = {
  groupConfig: {
    basePath: '/client',
  },
  routeDefinitions: [
    {
      method: RequestMethod.POST,
      endpoint: '/login',
      action: login,
    },
  ],
};

export default routeModule;
