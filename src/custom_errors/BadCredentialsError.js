class BadCredentialsError extends Error {
    constructor() {
        super('BadCredentialsError: The provided credentials are not correct!');

        this.name = 'BadCredentialsError';
        this.statusCode = 401;
    }
}

module.exports = BadCredentialsError;