import { mysqlQuery } from '#helpers/sql_database';
import { Test } from './model';
import { CoreApiError } from './error';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '#constants/error-codes.constant';

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

  /**
	 *
	 * @return {Promise<{username: *, status: *}>}
	 */
  async getSomethingMongo() {
    try {
      const test = await Test.findOne();

      if (!test) {
        throw new CoreApiError(
            'Something went wrong',
            StatusCodes.BAD_REQUEST,
            ERROR_CODES.INVALID,
        );
      }

      const response = {
        username: test.username,
        status: test.status,
      };

      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const coreServices = new CoreServices();
