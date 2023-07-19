import { bookServices } from './books';
import { catchAsync } from '#utils/index';

export const controller = {
  uploadImages: catchAsync(async (req, res) => {
    const response = await bookServices.createBook(req.body, req.files, req.params);

    res.jsend.success(response, {
      info: 'Images uploaded successfully',
    });
  }),

};
