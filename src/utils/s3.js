import AWS from 'aws-sdk';
import { envConfig } from '#configs/index';
import { logger } from '#helpers/index';

const s3 = new AWS.S3({
  accessKeyId: envConfig.AWS_ACCESS_KEY_ID,
  secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY,
  region: envConfig.AWS_REGION,
});

export const uploadFile = async (file, filename, fileType, folder) => {
  return new Promise((resolve, reject) => {
    try {
      const params = {
        Bucket: `${envConfig.AWS_BUCKET_NAME}/${folder}`,
        Key: `${folder}/${filename}`,
        Body: file.read,
        ContentType: fileType,
        ACL: 'public-read',
      };
      s3.upload(params, (err, data) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        resolve(data);
      });
    } catch (error) {
      logger.error(error);
      reject(new Error(`Something went wrong while uploading file, ${error.message}`));
    }
  });
};

export const getSignedUrl = async (filename, folder) => {
  return new Promise((resolve, reject) => {
    try {
      const params = {
        Bucket: `${envConfig.AWS_BUCKET_NAME}/${folder}`,
        Key: `${folder}/${filename}`,
        Expires: 60 * 60 * 24 * 7,
      };

      s3.getSignedUrl('getObject', params, (err, url) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        resolve(url);
      });
    } catch (error) {
      logger.error(error);
      reject(new Error(`Something went wrong while getting signed url, ${error.message}`));
    }
  });
};
