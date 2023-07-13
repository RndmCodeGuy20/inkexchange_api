import { Router } from 'express';
import {
  methodNotAllowed,
  validateSchema,
  validateUser,
} from '#middlewares/index';
import { controller as api } from './controller';
import { schema } from './schema';

const router = new Router();

router.route('/seller/register')
    .post(validateSchema(schema.register), api.register)
    .all(methodNotAllowed);
router.route('/seller/update/:id')
    .all(validateUser)
    .post(validateSchema(schema.updateSellerById), api.updateSellerById)
    .all(methodNotAllowed);

module.exports = router;
