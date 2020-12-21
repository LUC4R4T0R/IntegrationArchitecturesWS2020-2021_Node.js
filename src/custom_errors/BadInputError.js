class BadInputError extends Error {
    constructor(message) {
        super(message);

        this.name = 'BadInputError';
        this.statusCode = 510;
    }
}

module.exports = BadInputError;