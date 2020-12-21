class MissingElementError extends Error {
    constructor(message) {
        super(message);

        this.name = 'MissingElementError';
        this.statusCode = 400;
    }
}

module.exports = MissingElementError;