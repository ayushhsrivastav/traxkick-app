import {
  editArtist,
  editAlbum,
  insertAlbum,
  insertArtist,
  uploadMusic,
  editMusic,
} from '../../controllers/upload.controller';
import { isAdmin } from '../../middlewares';
import { RequestMethod, RouteModule } from '../route.interface';

const routeModule: RouteModule = {
  groupConfig: {
    basePath: '/upload',
    groupMiddlewares: [isAdmin],
  },
  routeDefinitions: [
    {
      method: RequestMethod.POST,
      endpoint: '/insert-song',
      action: uploadMusic,
    },
    {
      method: RequestMethod.POST,
      endpoint: '/update-song',
      action: editMusic,
    },
    {
      method: RequestMethod.POST,
      endpoint: '/insert-artist',
      action: insertArtist,
    },
    {
      method: RequestMethod.POST,
      endpoint: '/update-artist',
      action: editArtist,
    },
    {
      method: RequestMethod.POST,
      endpoint: '/insert-album',
      action: insertAlbum,
    },
    {
      method: RequestMethod.POST,
      endpoint: '/update-album',
      action: editAlbum,
    },
  ],
};

export default routeModule;
