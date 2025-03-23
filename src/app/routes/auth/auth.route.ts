import {
  getRefreshToken,
  checkAuth,
  userRole,
} from '../../controllers/auth.controller';
import { authentication } from '../../middlewares';
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
    {
      method: RequestMethod.GET,
      endpoint: '/role',
      middlewares: [authentication],
      action: userRole,
    },
  ],
};

export default routeModule;
