/**
 * CoreApiError
 * @class
 * @extends Error
 * @param {string} message
 * @param {number} httpStatus
 * @param {string} errorCode
 * @return {Error}
 */
class CoreApiError extends Error {
  /**
	 * @param {string} message
	 * @param {number} httpStatus
	 * @param {string} errorCode
	 */
  constructor(message, httpStatus, errorCode) {
    super(message);
    this.name = 'CoreApiError';
    this.status = httpStatus;
    this.errorCode = errorCode;
  }
}

export { CoreApiError };
