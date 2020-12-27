class NotAuthenticatedError extends Error {
    constructor() {
        super('NotAuthenticatedError: This function is only available after authentication!');

        this.name = 'NotAuthenticatedError';
        this.statusCode = 401;
    }
}

module.exports = NotAuthenticatedError;