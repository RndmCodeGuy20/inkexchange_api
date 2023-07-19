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
	 * @param {{
	 * }} body
	 * @param {[
	 *   fieldname: string,
	 *   originalname: string,
	 *   encoding: string,
	 *   mimetype: string,
	 *   destination: string,
	 *   filename: string,
	 *   path: [string],
	 * ]} files
	 * @param {string} sellerId
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
        images.push(`/image/${file.path}`);
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

  /**
	 * @description Get all books
	 * @param {{
	 *  search: string,
	 *  page: string,
	 *  items_per_page: string,
	 *  sort_by: string,
	 *  sort_order: string,
	 * }} query
	 * @return {Promise<*>}
	 */
  async getBooks(query) {
    try {
      const page = parseInt(query.page) || 1;
      const itemsPerPage = parseInt(query.items_per_page) || 10;
      const sortBy = query.sort_by || 'current_price';
      const sortOrder = query.sort_order === 'asc' ? 1 : -1;
      const skip = (page - 1) * itemsPerPage;
      const search = query.search || '';


      const booksQuery = await Book.find({
        '$or': [
          {
            name: new RegExp(search, 'i'),
          },
          {
            author: new RegExp(search, 'i'),
          },
          {
            genre: new RegExp(search, 'i'),
          },
        ],
      },
      {
        name: 1,
        author: 1,
        genre: 1,
        description: 1,
        images: 1,
        current_price: 1,
        original_price: 1,
      })
          .sort({ sortBy: sortOrder })
          .skip(0)
          .limit(10)
          .exec();

      console.log(booksQuery);

      const booksCountQuery = await Book.countDocuments({}).exec();

      const response = {};
      if (page * itemsPerPage < booksCountQuery) {
        response.next = {
          page: page + 1,
          items_per_page: itemsPerPage,
        };
      }

      if (skip > 0) {
        response.previous = {
          page: page - 1,
          items_per_page: itemsPerPage,
        };
      }

      response.data = {
        books: booksQuery,
        total_count: booksCountQuery,
        page: page,
        items_per_page: itemsPerPage,
      };

      return response;
    } catch (err) {
      throw err;
    }
  }

  /**
	 *
	 * @param {string} sellerId
	 * @param {[string]} files
	 * @return {Promise<*[]>}
	 */
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
