import { Router } from 'express';
import { controller as api } from './controller';
import { methodNotAllowed } from '#middlewares/index';

const upload = require('#middlewares/upload.middleware');
const router = new Router();

// router.route('/books/:sellerid').post(api.test);
router.route('/books/seller/:sellerid')
    .post(upload('image', 5), api.createBook)
    .get(api.getBookBySellerId)
    .all(methodNotAllowed);
router.route('/books/:bookid')
    .patch(api.updateBook)
    .get(api.getBookById)
    .all(methodNotAllowed);
router.route('/books')
    .get(api.getBooks)
    .post(upload('image', 5), api.createBook)
    .all(methodNotAllowed);

module.exports = router;
