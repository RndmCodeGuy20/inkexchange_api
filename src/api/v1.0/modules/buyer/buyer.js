import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '#constants/index';
import { BuyerApiError } from './error';
import { mysqlQuery } from '#helpers/index';
import {
  generateHash,
  generateToken,
  generateRefreshToken,
  compareHash,
} from '#utils/index';

/**
 * @class BuyerService
 * @description - Buyer Service, handles all the business logic for the buyer.
 * @exports BuyerService
 * @version 1.0.0
 * @since 1.0.0
 *
 */
class BuyerService {
  /**
	 * @description - Get buyer by id
	 * @param {{email: string, password: string}} body
	 * @return {Promise<void>}
	 * @throws {BuyerApiError}
	 */
  async register(body) {
    try {
      if (!body.email || !body.password) {
        throw new BuyerApiError(
            'Credentials are required',
            StatusCodes.BAD_REQUEST,
            ERROR_CODES.INVALID,
        );
      }
      const existingBuyerQuery = `SELECT *
																	FROM data_buyers
																	WHERE email_address = ?`;
      const existingBuyerResponse = await mysqlQuery({
        sql: existingBuyerQuery,
        values: [body.email],
      });

      if (existingBuyerResponse.length) {
        throw new BuyerApiError(
            'Buyer already exists',
            StatusCodes.CONFLICT,
            ERROR_CODES.INVALID,
        );
      }

      const hashedPassword = await generateHash(body.password);

      const registerUserQuery = `INSERT INTO data_buyers
																	 (email_address, password)
																 VALUES (?, ?)`;
      const registerUserResponse = await mysqlQuery({
        sql: registerUserQuery,
        values: [
          body.email,
          hashedPassword,
        ],
      });

      if (!registerUserResponse.affectedRows) {
        throw new BuyerApiError(
            'Something went wrong',
            StatusCodes.INTERNAL_SERVER_ERROR,
            ERROR_CODES.INVALID,
        );
      }

      const buyerInfoQuery = `SELECT *
															FROM data_buyers
															WHERE email_address = ?`;
      const buyerInfoResponse = await mysqlQuery({
        sql: buyerInfoQuery,
        values: [body.email],
      });

      if (!buyerInfoResponse.length) {
        throw new BuyerApiError(
            'Something went wrong',
            StatusCodes.INTERNAL_SERVER_ERROR,
            ERROR_CODES.INVALID,
        );
      }

      const buyer = {
        buyer_id: buyerInfoResponse[0].buyer_id,
        email_address: buyerInfoResponse[0].email_address,
      };

      const response = {
        buyer_id: buyerInfoResponse[0].buyer_id,
        status: buyerInfoResponse[0].status,
        is_first_login: buyerInfoResponse[0].is_first_login,
        access_token: generateToken({ buyer }),
        refresh_token: generateRefreshToken({ id: buyerInfoResponse[0].buyer_id }),
      };

      return response;
    } catch (err) {
      throw err;
    }
  }

  /**
	 * @description - Login buyer
	 * @param {{email: string, password: string}} body
	 * @return {Promise<{access_token: (*), refresh_token: (*), buyer_details: any, buyer_id: *}>}
	 */
  async login(body) {
    try {
      if (!body.email || !body.password) {
        throw new BuyerApiError(
            'Credentials are required',
            StatusCodes.BAD_REQUEST,
            ERROR_CODES.INVALID,
        );
      }

      const existingBuyerQuery = `SELECT *
																	FROM data_buyers
																	WHERE email_address = ?`;
      const existingBuyerResponse = await mysqlQuery({
        sql: existingBuyerQuery,
        values: [body.email],
      });

      if (!existingBuyerResponse.length) {
        throw new BuyerApiError('Buyer does not exist', StatusCodes.NOT_FOUND, ERROR_CODES.NOT_ALLOWED);
      }

      const existingBuyer = existingBuyerResponse[0];
      const isPasswordValid = compareHash(body.password, existingBuyer.password);

      if (!isPasswordValid) {
        throw new BuyerApiError('Password is invalid', StatusCodes.UNAUTHORIZED, ERROR_CODES.NOT_ALLOWED);
      }

      await mysqlQuery({
        sql: `UPDATE data_buyers
							SET is_first_login = 0
							WHERE buyer_id = ?`,
        values: [existingBuyer.buyer_id],
      });

      const buyer = {
        email: existingBuyer.email_address,
        first_name: existingBuyer.first_name,
        last_name: existingBuyer.last_name,
        phone_number: existingBuyer.phone_number,
      };

      const response = {
        buyer_id: existingBuyer.buyer_id,
        buyer_details: JSON.parse(JSON.stringify(buyer)),
        access_token: generateToken({ buyer }),
        refresh_token: generateRefreshToken({ id: existingBuyer.buyer_id }),
      };

      return response;
    } catch (e) {
      throw e;
    }
  }

  /**
	 * @description - Update buyer profile by id
	 * @param {{}} body
	 * @param {string} buyerId
	 * @param {boolean} isFirstLogin
	 * @return {Promise<void>}
	 */
  async updateBuyerById(body, { id: buyerId }, { is_first_login: isFirstLogin }) {
    try {
      // check if buyer exists
      const buyerExistsQuery = `SELECT *
																FROM data_buyers
																WHERE buyer_id = ?`;
      const buyerExistsResponse = await mysqlQuery({
        sql: buyerExistsQuery,
        values: [buyerId],
      });

      if (!buyerExistsResponse.length) {
        throw new BuyerApiError(
            'Buyer does not exist',
            StatusCodes.NOT_FOUND,
            ERROR_CODES.NOT_ALLOWED,
        );
      }

      const updateBuyerQuery = `UPDATE data_buyers
																SET ?
																WHERE buyer_id = ?`;

      await mysqlQuery({
        sql: updateBuyerQuery,
        values: [
          {
            first_name: body.first_name,
            last_name: body.last_name,
            phone_number: body.phone_number,
            address: body.address,
            is_first_login: isFirstLogin ? 1 : 0,
          },
          buyerId,
        ],
      });

      return;
    } catch (e) {
      throw e;
    }
  }
}

export const buyerService = new BuyerService();
