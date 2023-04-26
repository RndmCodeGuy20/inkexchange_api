import { Router } from 'express';
import {
  methodNotAllowed,
  validateSchema,
} from '#middlewares/index';
import { controller as api } from './controller';
import { schema } from './schema';

const router = new Router();

router.route('/register').post(validateSchema(schema.register), api.register).all(methodNotAllowed);

module.exports = router;
