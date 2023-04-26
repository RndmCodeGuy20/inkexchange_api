import { Router } from 'express';
import apiRoutes from './modules/core/routes';
import buyerRoutes from './modules/buyer/routes';

const router = new Router();

router.get('/', (req, res) => {
  res.jsend.success('V1.0 API');
});

router.use(apiRoutes);
router.use(buyerRoutes);
export default router;
