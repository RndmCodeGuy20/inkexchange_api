import { Router } from 'express';
import { controller as api } from './controller';

const router = new Router();

router.route('/something').get(api.getSomething);

module.exports = router;
