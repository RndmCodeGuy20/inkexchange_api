import { catchAsync } from '#utils/index';
import { buyerService } from './buyer';

export const controller = {
  register: catchAsync(async (req, res) => {
    const response = await buyerService.register(req.body);
    // console.log(response);
    res.jsend.success(response, {
      info: 'Buyer registered successfully',
    });
  }),
  updateBuyerById: catchAsync(async (req, res) => {
    await buyerService.updateBuyerById(req.body, req.params, req.query);
    res.jsend.success(null, {
      info: 'Buyer profile updated successfully',
    });
  }),
};
