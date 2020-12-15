class ElementDuplicateError extends Error {
    constructor(message) {
        super(message);

        this.name = 'ElementDuplicateError';
        this.statusCode = 409;
    }
}

module.exports = ElementDuplicateError;