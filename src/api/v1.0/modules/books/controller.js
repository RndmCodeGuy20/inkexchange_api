import { bookServices } from './books';
import { catchAsync } from '#utils/index';

export const controller = {
  createBook: catchAsync(async (req, res) => {
    const response = await bookServices.createBook(req.body, req.files, req.params);

    res.jsend.success(response, {
      info: 'Images uploaded successfully',
    });
  }),

  getBooks: catchAsync(async (req, res) => {
    const response = await bookServices.getBooks(req.query);

    res.jsend.success(response, {
      info: 'Books retrieved successfully',
    });
  }),

  getBookBySellerId: catchAsync(async (req, res) => {
    const response = await bookServices.getBookBySellerId(req.params, req.query);

    res.jsend.success(response, {
      info: 'Book retrieved successfully',
    });
  }),

  getBookById: catchAsync(async (req, res) => {
    const response = await bookServices.getBookById(req.params);

    res.jsend.success(response, {
      info: 'Book retrieved successfully',
    });
  }),

  updateBook: catchAsync(async (req, res) => {
    const response = await bookServices.updateBook(req.body, req.params);

    res.jsend.success(response, {
      info: 'Book updated successfully',
    });
  }),

  test: catchAsync(async (req, res) => {
    console.log(req.params);

    res.jsend.success(req.params, {
      info: 'Book retrieved successfully',
    });
  }),
};
