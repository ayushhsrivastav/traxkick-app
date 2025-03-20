import { uploadMusic } from '../../controllers/upload.controller';
import { credentials } from '../../middlewares/auth.middleware';
import { RequestMethod, RouteModule } from '../route.interface';

const routeModule: RouteModule = {
  groupConfig: {
    basePath: '/uploads',
  },
  routeDefinitions: [
    {
      method: RequestMethod.POST,
      endpoint: '/music',
      action: uploadMusic,
      middlewares: [credentials],
    },
  ],
};

export default routeModule;
