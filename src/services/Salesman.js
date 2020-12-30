let BadInputError = require('../custom_errors/BadInputError');
let MissingElementError = require('../custom_errors/MissingElementError');
let Salesman = require('../models/Salesman');

//add a bonus salary to a salesman
exports.addBonus = async function (orange, id, year, amount) {
    if (orange === undefined || id === undefined || year === undefined || amount === undefined) {
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    } else {
        if (!id.match(/^[\d]+$/g) || !year.match(/^[\d]+$/g) || !amount.match(/^[\d]+$/g)) {
            throw new BadInputError();
        }
        await orange.addBonusSalary(id, year, amount);
        return amount;
    }
}

//read Salesman
exports.readSalesman = async function (orange, id, queryString) {
    if (orange === undefined) {
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    } else {
        if (id === undefined && queryString === undefined) {
            let sms = await orange.getSalesmen();
            return sms.map(sm => {
                return new Salesman(sm.code, sm.firstName, sm.lastName);
            });
        } else if (queryString === undefined) {
            let sm = await orange.getEmployeeInfo(id);
            return new Salesman(sm.code, sm.firstName, sm.lastName);
        }
    }
};
