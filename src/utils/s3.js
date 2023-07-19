import S3 from 'aws-sdk/clients/s3';
import { envConfig } from '#configs/index';
import { logger } from '#helpers/index';
import * as fs from 'fs';

const s3 = new S3({
  accessKeyId: envConfig.AWS_ACCESS_KEY_ID,
  secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY,
  region: envConfig.AWS_REGION,
});

export const uploadFile = (file, fileName, fileType, directory) => {
  return new Promise((resolve, reject) => {
    try {
      const fileStream = fs.createReadStream(file.path);
      const params = {
        Bucket: `${envConfig.AWS_BUCKET_NAME}/${directory}`,
        Key: fileName,
        ContentType: fileType,
        Body: fileStream,
      };
      s3.upload(params, (err, data) => {
        if (err) {
          logger.error(err);
          reject(new Error('Error uploading file. Please try again.'));
        }
        data.fileName = fileName;
        resolve(data);
      });
    } catch (error) {
      logger.error(error);
      reject(new Error(`Something went wrong while uploading file. Please try again.${error.message}`));
    }
  });
};
