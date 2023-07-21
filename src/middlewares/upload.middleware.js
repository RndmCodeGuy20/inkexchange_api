import { join, extname } from 'path';
import * as fs from 'fs';

const multer = require('multer');

const bookData = {
  bookName: '',
  sellerId: '',
};

/**
 * @class UploadMiddlewareError
 * @extends Error
 */
class UploadMiddlewareError extends Error {
  /**
	 * @param {string} message
	 * @param {number} httpStatus
	 * @param {string} errorCode
	 */
  constructor(message, httpStatus, errorCode) {
    super(message);
    this.name = 'UploadMiddlewareError';
    this.status = httpStatus;
    this.errorCode = errorCode;
  }
}

const storage = multer.diskStorage({
  /**
	 *
	 * @param {{
	 *   body: {
	 *   name: string,
	 *   author: string,
	 *   description: string
	 *   },
	 *   params: {
	 *   sellerid: string
	 *   }
	 * }} req
	 * @param file
	 * @param callback
	 */
  destination(req, file, callback) {
    try {
      bookData.bookName = req.body.name;
      bookData.sellerId = req.params.sellerid;

      try {
        fs.mkdirSync(join('.data', bookData.sellerId, 'books', bookData.bookName), { recursive: true });
      } catch (err) {
        if (err.code !== 'EEXIST') {
          throw new UploadMiddlewareError('Directory could not be created', 500, 'UPLOAD_ERROR');
        }
      }

      switch (file.fieldname) {
        default: {
          callback(null, join('.data', bookData.sellerId, 'books', bookData.bookName));
          break;
        }
      }
    } catch (err) {
      throw err;
    }
  },
  filename(req, file, callback) {
    try {
      callback(null, `${file.fieldname}_${bookData.sellerId}_${Date.now()}${extname(file.originalname)}`);
    } catch (err) {
      throw err;
    }
  },
});


const uploadMiddleware = (fieldName, count) => {
  return multer({
    storage,
    limits: { fieldSize: 25 * 1024 * 1024 },
  }).array(fieldName, count);
};

module.exports = uploadMiddleware;
