import { Router } from 'express';
import apiRoutes from './modules/core/routes';

const router = new Router();

router.get('/', (req, res) => {
  res.jsend.success('V1.0 API');
});

router.use(apiRoutes);
export default router;
