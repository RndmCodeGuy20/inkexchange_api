import { Router } from 'express';
import apiRoutes from './modules/core/routes';
import buyerRoutes from './modules/buyer/routes';
import sellerRoutes from './modules/seller/routes';
import bookRoutes from './modules/books/routes';

const router = new Router();

router.get('/', (req, res) => {
  res.jsend.success('V1.0 API');
});

router.use(apiRoutes);
router.use(buyerRoutes);
router.use(sellerRoutes);
router.use(bookRoutes);

export default router;
