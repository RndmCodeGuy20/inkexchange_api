import { mysqlQuery } from '#helpers/database';

/**
 * class CoreServices
 */
class CoreServices {
  /**
	 *
	 * @return {Promise<void>}
	 */
  async getSomething() {
    try {
      const query = `SELECT *
										 FROM test.movies`;
      return await mysqlQuery({ sql: query });
    } catch (error) {
      throw error;
    }
  }
}

export const coreServices = new CoreServices();
