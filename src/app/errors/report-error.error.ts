import config from '../../config/config';
import { errorGateway } from '../database';
import { BaseError } from '../utils/error.utils';

export async function reportError(error: BaseError) {
  const { report_error, ...body } = error;
  if (report_error) {
    const log = {
      is_server: config.is_server,
      ...body,
      time: new Date(),
    };

    errorGateway.insertOne({ record: log }).catch(error => {
      console.error(error);
    });
  }

  return;
}
