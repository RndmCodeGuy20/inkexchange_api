import { mysqlQuery } from "#helpers/database";
import { logger } from "#helpers/index";

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
										 FROM data_devices`;
			const response = await mysqlQuery({ sql: query });

			return response;
		} catch (error) {
			throw error;
		}
	}
}

export const coreServices = new CoreServices();
