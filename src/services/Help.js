let BadInputError = require('../custom_errors/BadInputError');
let MissingElementError = require('../custom_errors/MissingElementError');

exports.checkIfParamIsUndefined = function (db, one, two, three) {
    if (db === undefined || one === undefined || two === undefined || three === undefined) {
        throw new MissingElementError();
    }
}

exports.checkForBadInput= function (id, year = "0",name="test") {
    if (!id.match(/^[\d]+$/g) || !year.match(/^[\d]+$/g) || !name.match(/^[\w]+$/g)) {
        throw new BadInputError();
    }
}
