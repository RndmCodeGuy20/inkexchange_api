import { BooksApiError } from './error';
import { ERROR_CODES } from '#constants/error-codes.constant';
import { StatusCodes } from 'http-status-codes';
import { Book } from './model';

/**
 * @description Book services
 */
class BookServices {
  /**
	 * @description Create a new book
	 * @param {{
	 * name: string,
	 * author: string,
	 * description: string,
	 * genre: string,
	 * pages: number,
	 * current_price: number,
	 * original_price: number,
	 * previous_price: number,
	 * condition: string,
	 * status: string,
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
  async createBook(body, files, { sellerid: sellerId }) {
    try {
      if (!body.name || !body.author || !body.original_price) {
        throw new BooksApiError(
            'name, author and original price is needed.',
            ERROR_CODES.INVALID,
            StatusCodes.BAD_REQUEST,
        );
      }

      const checkExistingBookQuery = await Book.findOne({
        title: body.name,
        author: body.author,
        seller_id: sellerId,
      });

      if (checkExistingBookQuery) {
        throw new BooksApiError('Book already exists', ERROR_CODES.INVALID, StatusCodes.CONFLICT);
      }

      const images = [];

      for (const file of files) {
        const filePath = file.path.split('\\').slice(1).join('/');

        images.push(`/images/${filePath}`);
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
          .limit(itemsPerPage)
          .exec();

      const booksCountQuery = await Book.countDocuments({}).exec();

      const response = {};
      if (page * itemsPerPage < booksCountQuery) {
        response.next = {
          page: page + 1,
          items_per_page: itemsPerPage,
          next_page_count: booksCountQuery - page * itemsPerPage,
        };
      }

      if (skip > 0) {
        response.previous = {
          page: page - 1,
          items_per_page: itemsPerPage,
          previous_page_count: skip,
        };
      }

      response.books = booksQuery;
      response.total_count = booksCountQuery;
      response.page = page;


      return response;
    } catch (err) {
      throw err;
    }
  }

  /**
	 *
	 * @param {string} sellerId
	 * @param {{
	 * limit: string,
	 * page: string,
	 * sort: string,
	 * order: string,
	 * }} query
	 * @return {Promise<*>}
	 */
  async getBookBySellerId({ sellerid: sellerId }, query) {
    try {
      const limit = parseInt(query.limit) ? parseInt(query.limit) : 10;
      const page = parseInt(query.page) ? parseInt(query.page) : 1;
      const sort = query.sort ? query.sort : 'created_at';
      const order = parseInt(query.order) ? parseInt(query.order) : -1;
      const skip = (page - 1) * limit;


      if (!sellerId) {
        throw new BooksApiError('Seller id is required', ERROR_CODES.INVALID, StatusCodes.BAD_REQUEST);
      }

      const bookQuery = await Book.find({
        seller_id: sellerId,
      })
          .sort({ sort: order })
          .skip(skip)
          .limit(limit)
          .exec();

      if (!bookQuery) {
        throw new BooksApiError('Book not found', ERROR_CODES.INVALID, StatusCodes.NOT_FOUND);
      }

      const bookQueryLength = await Book.countDocuments().exec();

      const response = {};

      response.book = bookQuery;
      response.total_count = bookQueryLength;
      response.page = page;

      if (page * limit < bookQueryLength) {
        response.next = {
          page: page + 1,
          limit: limit,
          count: bookQueryLength - page * limit,
        };
      }

      if (skip > 0) {
        response.previous = {
          page: page - 1,
          limit: limit,
          count: skip,
        };
      }
      return response;
    } catch (e) {
      throw e;
    }
  }

  /**
	 * @param {string} bookId
	 * @return {Promise<*>}
	 */
  async getBookById({ bookid: bookId }) {
    try {
      if (!bookId) {
        throw new BooksApiError('Book id is required', ERROR_CODES.INVALID, StatusCodes.BAD_REQUEST);
      }

      const bookQuery = await Book.findOne({
        _id: bookId,
      });

      if (!bookQuery) {
        throw new BooksApiError('Book not found', ERROR_CODES.INVALID, StatusCodes.NOT_FOUND);
      }

      const response = {
        book: bookQuery,
        status: 'OK',
      };

      return response;
    } catch (e) {
      throw e;
    }
  }

  async updateBook(body, { bookid: bookId }) {
    try {
      if (!bookId) {
        throw new BooksApiError('Book id is required', ERROR_CODES.INVALID, StatusCodes.BAD_REQUEST);
      }

      const existingBookQuery = await Book.findOne({
        _id: bookId,
      });

      if (!existingBookQuery) {
        throw new BooksApiError('Book not found', ERROR_CODES.INVALID, StatusCodes.NOT_FOUND);
      }

      const updateBookQuery = await Book.updateOne({
        _id: bookId,
      }, {
        $set: {
          name: body.name || existingBookQuery.name,
          title: body.title || existingBookQuery.title,
          description: body.description || existingBookQuery.description,
          current_price: body.current_price || existingBookQuery.current_price,
          original_price: body.original_price || existingBookQuery.original_price,
          previous_price: body.previous_price || existingBookQuery.previous_price,
          condition: body.condition || existingBookQuery.condition,
          status: body.status || existingBookQuery.status,
        },
      });

      if (!updateBookQuery) {
        throw new BooksApiError('Book could not be updated', ERROR_CODES.INVALID, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      const response = {
        book_id: bookId,
        status: 'OK',
        info: updateBookQuery,
      };

      return response;
    } catch (e) {
      throw e;
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
