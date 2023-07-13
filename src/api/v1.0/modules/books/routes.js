import { Router } from 'express';
import { controller as api } from './controller';
import { methodNotAllowed } from '#middlewares/route.middleware';
import { upload } from '#utils/multer_upload';

const router = new Router();

router.route('/books/upload').post(upload.single('images'), api.uploadImages).all(methodNotAllowed);

module.exports = router;
