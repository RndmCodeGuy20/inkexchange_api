import { Router } from 'express';
import {
  methodNotAllowed,
  validateSchema,
  validateUser,
} from '#middlewares/index';
import { controller as api } from './controller';
import { schema } from './schema';

const router = new Router();

router.route('/buyer/register')
    .post(validateSchema(schema.register),
        api.register)
    .all(methodNotAllowed);
router.route('/buyer/login')
    .post(validateUser, validateSchema(schema.login), api.login)
    .all(methodNotAllowed);
router.route('/buyer/update/:id')
    .all(validateUser)
    .post(validateSchema(schema.updateBuyerById), api.updateBuyerById)
    .all(methodNotAllowed);


module.exports = router;
