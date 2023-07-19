import { Router } from 'express';
import { controller as api } from './controller';
import { methodNotAllowed } from '#middlewares/index';

const upload = require('#middlewares/upload.middleware');
const router = new Router();

router.route('/books/create/:id').post(upload('image', 5), api.uploadImages).all(methodNotAllowed);

module.exports = router;
