import { login, signup, logout } from '../../controllers/client.controller';
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
    {
      method: RequestMethod.POST,
      endpoint: '/signup',
      action: signup,
    },
    {
      method: RequestMethod.GET,
      endpoint: '/logout',
      action: logout,
    },
  ],
};

export default routeModule;
