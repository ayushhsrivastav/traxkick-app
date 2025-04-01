import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import config from '../../config/config';
import { readFile, unlink } from 'fs/promises';
import { reportError } from '../errors/report-error.error';
import { BaseError } from '../utils/error.util';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export async function uploadFile(
  filePath: string,
  fileName: string,
  existingKey?: string
): Promise<string> {
  try {
    const fileStream = await readFile(filePath);

    const key = existingKey ? existingKey : `music/${fileName}_${Date.now()}`;

    const params: PutObjectCommandInput = {
      Bucket: config.aws.bucketName,
      Key: key,
      Body: fileStream,
      ContentType: 'audio/mpeg',
    };

    await s3.send(new PutObjectCommand(params));

    await unlink(filePath);

    return key;
  } catch (error) {
    reportError(new BaseError('AWS_ERROR', true, true, error));
    throw error;
  }
}

export async function getSignedUrlForAudio(key: string) {
  const command = new GetObjectCommand({
    Bucket: config.aws.bucketName,
    Key: key,
  });

  const url = await getSignedUrl(s3, command, {
    expiresIn: 60 * 60 * 24,
  });

  return url;
}
