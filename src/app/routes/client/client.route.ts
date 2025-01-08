import { fetchDetails } from '../../controllers/client.controller';
import { RequestMethod, RouteModule } from '../route.interface';

const routeModule: RouteModule = {
  groupConfig: {
    basePath: '/client',
  },
  routeDefinitions: [
    {
      method: RequestMethod.POST,
      endpoint: '/fetchDetails',
      action: fetchDetails,
    },
  ],
};

export default routeModule;
