/**
 * @description Error class for Books API
 * @class BooksApiError
 * @extends {Error}
 */
class BooksApiError extends Error {
  /**
	 * @description Creates an instance of BooksApiError.
	 * @param {string} message
	 * @param {number} code
	 * @param {string} error
	 */
  constructor(message, code, error) {
    super(message);
    this.code = code;
    this.error = error;
  }
}
