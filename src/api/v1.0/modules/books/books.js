import { BooksApiError } from './error';
import { ERROR_CODES } from '#constants/error-codes.constant';
import { StatusCodes } from 'http-status-codes';
import { Book } from './model';

/**
 * @description Book services
 */
class BookServices {
  /**
	 * @description Create a book
	 * @param {{}} body
	 * @param {[
	 *   fieldname: string,
	 *   originalname: string,
	 *   encoding: string,
	 *   mimetype: string,
	 *   destination: string,
	 *   filename: string,
	 *   path: [string],
	 * ]} files
	 * @param {string}sellerId
	 * @return {Promise<*>}
	 */
  async createBook(body, files, { id: sellerId }) {
    try {
      if (!body.name || !body.author || !body.current_price) {
        throw new BooksApiError('Title, author and price are required', ERROR_CODES.INVALID, StatusCodes.BAD_REQUEST);
      }

      const checkExistingBookQuery = await Book.findOne({
        title: body.title,
        author: body.author,
        seller_id: sellerId,
      });

      if (checkExistingBookQuery) {
        throw new BooksApiError('Book already exists', ERROR_CODES.INVALID, StatusCodes.CONFLICT);
      }

      const images = [];

      for (const file of files) {
        images.push(file.path);
      }

      const addBookQuery = await Book.create({
        name: body.name,
        author: body.author,
        description: body.description,
        seller_id: sellerId,
        genre: body.genre,
        pages: body.pages,
        images: images,
        current_price: body.current_price,
        original_price: body.original_price,
        previous_price: body.previous_price,
        condition: body.condition,
        status: body.status,
      });

      console.log(addBookQuery);

      const response = {
        book_id: addBookQuery._id,
        title: addBookQuery.title,
        status: 'OK',
      };

      return response;
    } catch (e) {
      throw e;
    }
  }

  async uploadImages({ id: sellerId }, files) {
    try {
      const images = [];

      for (const file of files) {
        images.push(file.path);
      }

      return images;
    } catch (err) {
      throw err;
    }
  }
}

export const bookServices = new BookServices();
