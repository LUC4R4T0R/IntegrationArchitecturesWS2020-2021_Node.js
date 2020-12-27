class NotAuthenticatedError extends Error {
    constructor(message = 'NotAuthenticatedError: This function is only available after authentication!') {
        super(message);

        this.name = 'NotAuthenticatedError';
        this.statusCode = 401;
    }
}

module.exports = NotAuthenticatedError;