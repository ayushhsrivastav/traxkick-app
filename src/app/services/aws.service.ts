import AWS from 'aws-sdk';
import config from '../../config/config';
import { readFile, unlink } from 'fs/promises';
import { reportError } from '../errors/report-error.error';
import { BaseError } from '../utils/error.util';

const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

export async function uploadFile(
  filePath: string,
  fileName: string
): Promise<string> {
  try {
    const fileStream = await readFile(filePath);

    const key = `music/${fileName}_${Date.now()}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: config.aws.bucketName,
      Key: key,
      Body: fileStream,
      ContentType: 'audio/mpeg',
    };

    await s3.upload(params).promise();

    await unlink(filePath);

    return key;
  } catch (error) {
    reportError(new BaseError('AWS_ERROR', true, true, error));
    throw error;
  }
}
