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
};
