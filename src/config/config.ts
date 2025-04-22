import dotEnv from 'dotenv';

const env = process.env;

if (env.NODE_ENV)
  dotEnv.config({ path: `src/app/environments/${env.NODE_ENV}.env` });
else dotEnv.config();

export default {
  port: Number(env.PORT) || 3000,
  is_server: env.IS_SERVER === 'true',
  environment: env.ENVIRONMENT,
  clientUrl: env.CLIENT_URL!,
  serverUrl: env.SERVER_URL,
  database: {
    url: env.DATABASE_URL!,
    name: env.DATABASE_NAME!,
    reconnect_time: Number(env.DATABASE_RECONNECT_TIME),
    reconnection: env.DATABASE_RECONNECTION === 'true',
  },
  jwt: {
    accessTokenSecret: env.ACCESS_TOKEN_SECRET!,
    refreshTokenSecret: env.REFRESH_TOKEN_SECRET!,
  },
  aws: {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
    region: env.AWS_REGION!,
    bucketName: env.AWS_BUCKET_NAME!,
  },
};
