import { bookServices } from './books';
import { catchAsync } from '#utils/catchAsync';

export const controller = {
  uploadImages: catchAsync(async (req, res) => {
    console.log('files', req.params);
    // const response = await bookServices.uploadBookImages(req.file);

    res.jsend.success('response', {
      info: 'Images uploaded successfully',
    });
  }),
};
