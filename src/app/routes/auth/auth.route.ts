import { getRefreshToken, checkAuth } from '../../controllers/auth.controller';
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
    {
      method: RequestMethod.GET,
      endpoint: '/check-auth',
      action: checkAuth,
    },
  ],
};

export default routeModule;
