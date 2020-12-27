class BadInputError extends Error {
    constructor(message = 'BadInputError: That kind of input was not expected!') {
        super(message);

        this.name = 'BadInputError';
        this.statusCode = 510;
    }
}

module.exports = BadInputError;