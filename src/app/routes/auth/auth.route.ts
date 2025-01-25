import { getRefreshToken } from '../../controllers/auth.controller';
import { RequestMethod, RouteModule } from '../route.interface';

const routeModule: RouteModule = {
  groupConfig: {
    basePath: '/auth',
  },
  routeDefinitions: [
    {
      method: RequestMethod.POST,
      endpoint: '/refresh-token',
      action: getRefreshToken,
    },
  ],
};

export default routeModule;
