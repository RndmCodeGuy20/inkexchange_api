import { catchAsync } from '#utils/catchAsync';
import { sellerService } from './seller';

export const controller = {
  register: catchAsync(async (req, res) => {
    const response = await sellerService.register(req.body);
    res.jsend.success(response, {
      info: 'Seller registered successfully',
    });
  }),
  updateSellerById: catchAsync(async (req, res) => {
    const response = await sellerService.updateSellerById(req.body, req.query, req.params);
    res.jsend.success(response, {
      info: 'Seller updated successfully',
    });
  }),
};


