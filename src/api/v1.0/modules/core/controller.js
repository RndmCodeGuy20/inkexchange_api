import { catchAsync } from '#utils/index';
import { coreServices } from './core';

export const controller = {
  getSomething: catchAsync(async (req, res) => {
    const response = await coreServices.getSomething();
    res.jsend.success(response);
  }),
  getSomethingMongo: catchAsync(async (req, res) => {
    const response = await coreServices.getSomethingMongo();
    res.jsend.success(response);
  }),
};
