import Joi from 'joi';

export const schema = {
  register: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  updateBuyerById: {
    body: Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      phone_number: Joi.string().required(),
      address: Joi.string().required(),
    }),
  },
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
};
