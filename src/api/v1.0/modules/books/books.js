import { uploadFile } from '#utils/s3';

/**
 * @description Book services
 */
class BookServices {
  /**
	 * @description Upload book images
	 * @param {{}} body
	 * @return {Promise<*[]>}
	 */
  async uploadBookImages(body) {
    try {
      // upload images to s3
      const images = [];
      for (const image of body.images) {
        const { filename, mimetype, createReadStream } = await image;
        const file = {
          read: createReadStream(),
          filename,
          mimetype,
        };
        const { Location } = await uploadFile(file, filename, mimetype, 'books');
        images.push(Location);
      }

      return images;
    } catch (err) {
      throw err;
    }
  }
}

export const bookServices = new BookServices();
