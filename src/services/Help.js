/*
This file stores two methods. There purpose is to check for common errors. These methods are used in every Service file.
 */

let BadInputError = require('../custom_errors/BadInputError');
let MissingElementError = require('../custom_errors/MissingElementError');

/**
 * This method checks for missing elements and is used in all service files.
 *
 * @throws MissingElementError
 */
exports.checkIfOneOrMoreParamsAreUndefined = function (db, one, two, three) {
    if (db === undefined || one === undefined || two === undefined || three === undefined) {
        throw new MissingElementError();
    }
}

/**
 * This method checks if the id, year or name does not have the right content.
 *
 * @param id the salesman id
 * @param year the year of records or reviews
 * @param name some kind of name
 *
 * @throws BadInputError
 */
exports.checkForBadInput = function (id, year = "0", name = "test") {
    if (!id.match(/^[\d]+$/g) || !year.match(/^[\d]+$/g) || !name.match(/^[\w ]+$/g)) {
        throw new BadInputError();
    }
}
