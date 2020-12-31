class MissingElementError extends Error {
    constructor(message = "MissingElementError: At least one of the required parameters is undefined!") {
        super(message);

        this.name = 'MissingElementError';
        this.statusCode = 400;
    }
}

module.exports = MissingElementError;
