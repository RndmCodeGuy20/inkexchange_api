import { Router } from 'express';
import { methodNotAllowed } from '#middlewares/index';
import { controller as api } from './controller';

const router = new Router();

router.route('/something').all(methodNotAllowed).get(api.getSomething);

export default router;
