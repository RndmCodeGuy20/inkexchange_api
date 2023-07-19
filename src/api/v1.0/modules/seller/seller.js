import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '#constants/index';
import { mysqlQuery } from '#helpers/index';
import { SellerApiError } from './error';
import {
  generateHash,
  generateToken,
  generateRefreshToken,
  compareHash,
} from '#utils/index';

/**
 * @class SellerServices
 * @description Defines all the actions that can be performed on the seller module
 * @exports SellerServices
 * @constructor
 * @public
 */
class SellerServices {
  /**
	 * @method login
	 * @param {{email: string, password: string}}body
	 * @return {Promise<{
	 * seller: {email_address: *, seller_id: *},
	 * is_first_login: boolean,
	 * refresh_token: (*),
	 * token: (*)
	 * }>}
	 */
  async register(body) {
    try {
      if (!body.email || !body.password) {
        throw new SellerApiError(
            'Credentials are required',
            StatusCodes.BAD_REQUEST,
            ERROR_CODES.INVALID,
        );
      }

      const existingSellerQuery = `SELECT *
																	 FROM data_sellers
																	 WHERE email_address = ?`;
      const existingSellerResponse = await mysqlQuery({
        sql: existingSellerQuery,
        values: [body.email],
      });

      if (existingSellerResponse.length) {
        throw new SellerApiError(
            'Seller already exists',
            StatusCodes.CONFLICT,
            ERROR_CODES.INVALID);
      }

      const hashedPassword = await generateHash(body.password);

      const registerSellerQuery = `INSERT INTO data_sellers
																		 (email_address, password)
																	 VALUES (?, ?)`;
      const registerSellerResponse = await mysqlQuery({
        sql: registerSellerQuery,
        values: [
          body.email,
          hashedPassword,
        ],
      });

      if (!registerSellerResponse.affectedRows) {
        throw new SellerApiError(
            'Unable to register seller',
            StatusCodes.INTERNAL_SERVER_ERROR,
            ERROR_CODES.INVALID,
        );
      }

      const sellerInfoQuery = `SELECT *
															 FROM data_sellers
															 WHERE email_address = ?`;
      const sellerInfoResponse = await mysqlQuery({
        sql: sellerInfoQuery,
        values: [body.email],
      });

      const seller = {
        seller_id: sellerInfoResponse[0].seller_id,
        email_address: sellerInfoResponse[0].email_address,
      };

      const response = {
        seller,
        is_first_login: 1,
        token: generateToken({ seller }),
        refresh_token: generateRefreshToken({ seller }),
      };

      return response;
    } catch (err) {
      throw err;
    }
  }

  /**
	 *
	 * @param {{}} body
	 * @param {boolean} isFirstLogin
	 * @param {string} sellerId
	 * @return {Promise<{
	 *   affectedRows: number
	 * }>}
	 */
  async updateSellerById(body, { is_first_login: isFirstLogin }, { id: sellerId }) {
    try {
      const getExistingSellerQuery = `SELECT *
																			FROM data_sellers
																			WHERE seller_id = ?`;
      const getExistingSellerResponse = await mysqlQuery({
        sql: getExistingSellerQuery,
        values: [sellerId],
      });

      if (!getExistingSellerResponse.length) {
        throw new SellerApiError(
            'Seller does not exist',
            StatusCodes.NOT_FOUND,
            ERROR_CODES.INVALID,
        );
      }

      if (body.is_whatsapp) {
        if (!body.whatsapp_number) {
          throw new SellerApiError(
              'Whatsapp number is required',
              StatusCodes.BAD_REQUEST,
              ERROR_CODES.INVALID,
          );
        }
      }

      const updateSellerQuery = `UPDATE data_sellers
																 SET ?
																 WHERE seller_id = ?`;
      const updateSellerResponse = await mysqlQuery({
        sql: updateSellerQuery,
        values: [
          {
            first_name: body.first_name,
            last_name: body.last_name,
            phone_number: body.phone_number,
            address: body.address,
            is_first_login: isFirstLogin ? 1 : 0,
            is_whatsapp: body.is_whatsapp,
            whatsapp_number: body.whatsapp_number,
            pan_number: body.pan_number,
            gstin_number: body.gstin_number,
          },
          sellerId,
        ],
      });

      if (!updateSellerResponse.affectedRows) {
        throw new SellerApiError(
            'Unable to update seller',
            StatusCodes.INTERNAL_SERVER_ERROR,
            ERROR_CODES.INVALID,
        );
      }

      return updateSellerResponse.affectedRows;
    } catch (error) {
      throw error;
    }
  }
}

export const sellerService = new SellerServices();
