import { Router } from 'express';
import { controller as api } from './controller';

const router = new Router();

router.route('/something').get(api.getSomething);
router.route('/something-mongo').get(api.getSomethingMongo);

module.exports = router;
