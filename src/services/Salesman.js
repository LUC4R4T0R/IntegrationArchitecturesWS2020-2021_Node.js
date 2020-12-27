let NoElementFoundError = require('../custom_errors/NoElementFoundError');
let BadInputError = require('../custom_errors/BadInputError');
let MissingElementError = require('../custom_errors/MissingElementError');

//add a bonus salary to a salesman
exports.addBonus = async function(orange, id, year, amount){
    if (orange === undefined || id === undefined || year === undefined || amount === undefined) {
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    } else {
        if (!id.match(/^[\d]+$/g)|| !year.match(/^[\d]+$/g) || !amount.match(/^[\d]+$/g)){
            throw new BadInputError("BadInputError: The queryString must be at least a character (example input 'a')!");
        }
        await orange.addBonusSalary(id,year,amount);
        return amount;
    }
}

//read Salesman
exports.readSalesman = async function (orange, id, queryString) {
    if (orange === undefined) {
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    } else {
        if (id === undefined && queryString === undefined) {
            return await orange.getSalesmen();
        }else if (queryString === undefined) {
            return await orange.getEmployeeInfo(id);
        }
    }
};
