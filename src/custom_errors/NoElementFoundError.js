class NoElementFoundError extends Error {
    constructor(message) {
        super(message);

        this.name = 'NoElementFoundError';
        this.statusCode = 404;
    }
}

module.exports = NoElementFoundError;