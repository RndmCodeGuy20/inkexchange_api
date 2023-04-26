import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '#constants/index';
import { BuyerApiError } from './error';
import { mysqlQuery } from '#helpers/index';
import { generateHash, generateToken, generateRefreshToken } from '#utils/index';

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
	 *
	 * @param {{email: string, password: string}} body
	 * @return {Promise<void>}
	 */
  async register(body) {
    try {
      // body.email = verifyAndFormatMail(body.email);
      if (!body.email || !body.password) {
        throw new BuyerApiError(
            'Credentials are required',
            StatusCodes.BAD_REQUEST,
            ERROR_CODES.INVALID,
        );
      }
      const existingUserQuery = `SELECT *
																 FROM data_buyers
																 WHERE email_address = ?`;
      const existingUserResponse = await mysqlQuery({
        sql: existingUserQuery,
        values: [body.email],
      });

      if (existingUserResponse.length) {
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

      const buyer = {
        email: body.email,
        pass: body.password,
      };

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


      const response = {};

      // console.log(buyerInfoResponse[0].buyer_id);


      if (buyerInfoResponse) {
        response.buyer_id = buyerInfoResponse[0].buyer_id;
        response.access_token = generateToken({ buyer });
        response.refresh_token = generateRefreshToken({ id: buyer.buyer_id });
      }
      // console.log(buyer);
      return response;
    } catch (err) {
      throw err;
    }
  }

  /**
	 * @description - Update buyer profile by id
	 * @param {{}} reqData
	 * @param {string} buyerId
	 * @param {boolean} isFirstLogin
	 * @return {Promise<void>}
	 */
  async updateBuyerById(reqData, { buyer_id: buyerId }, { is_first_login: isFirstLogin }) {
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

      // check if buyer has already updated his profile, if not then update
      if (JSON.parse(isFirstLogin)) {
        const updateBuyerQuery = `UPDATE data_buyers (first_name, last_name, phone_number, address, is_first_login)
        																		VALUES (?, ?, ?, ?) WHERE buyer_id = ?`;
        await mysqlQuery({
          sql: updateBuyerQuery,
          values: [
            reqData.first_name,
            reqData.last_name,
            reqData.phone_number,
            reqData.address,
            true,
            buyerId,
          ],
        });
      }
      return;
    } catch (e) {
      throw e;
    }
  }
}

export const buyerService = new BuyerService();
