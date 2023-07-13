/**
 * Error class for Seller API
 * @class SellerApiError
 * @extends {Error}
 * @param {string} message - Error message
 * @param {number} httpStatus - HTTP status code
 * @param {number} errorCode - Error code
 * @return {SellerApiError}
 */
class SellerApiError extends Error {
  /**
	 * Creates an instance of SellerApiError.
	 * @param {string} message - Error message
	 * @param {number} httpStatus - HTTP status code
	 * @param {string} errorCode - Error code
	 */
  constructor(message, httpStatus, errorCode) {
    super(message);
    this.name = 'UserApiError';
    this.status = httpStatus;
    this.errorCode = errorCode;
  }
}

export { SellerApiError };
