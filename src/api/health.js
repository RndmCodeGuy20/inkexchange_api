import { pkgConfig } from '#configs/package.config';
import { getConnection } from '#helpers/database';

export const getHealth = async (req, res, next) => {
  try {
    await getConnection();
    res.jsend.success({
      name: pkgConfig.APP_NAME,
      version: pkgConfig.APP_VERSION,
      timestamp: new Date().toISOString(),
    }, {
      info: 'You are on health route all systems active.',
    }, 200);
  } catch (err) {
    next(err);
  }
};
