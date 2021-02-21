let NoElementFoundError = require('../custom_errors/NoElementFoundError');
let SalesmanService = require('../models/Salesman');
let helper_function = require('./Help');

/**
 * This method adds a bonus into the OrangeHRM profile of a salesman.
 *
 * @param orange the OrangeHRM connection
 * @param id the id of the salesman the bonus is for
 * @param year the year the bonus is distributed
 * @param amount the amount of the bonus
 * @returns {Promise<number>} This method returns the amount of the bonus.
 */
exports.addBonus = async function (orange, id, year, amount) {
    //check for wrong or missing inputs
    helper_function.checkIfOneOrMoreParamsAreUndefined(orange, id, year, amount);
    helper_function.checkForBadInput(id, year);
    helper_function.checkForBadInput(amount);

    //add the bonus via the OrangeHRM connector function
    await orange.addBonusSalary(id, year, amount);
};

/**
 * This method gets all salesmen from OrangeHRM.
 *
 * @param orange the OrangeHRM connection
 * @returns {Promise<[Salesman]>} This method returns an array of salesmen.
 */
exports.readAllSalesman = async function (orange) {
    //check for missing inputs
    helper_function.checkIfOneOrMoreParamsAreUndefined(orange, null, null, null);

    //get all salesmen
    let allSalesmen = await orange.getSalesmen();

    //map the salesmen to the salesman model and return the salesman array
    return allSalesmen.map(sm => {
        return new SalesmanService(parseInt(sm.code), sm.firstName, sm.lastName);
    });
};

/**
 *  This method gets one salesmen from OrangeHRM.
 *
 * @param orange the OrangeHRM connection
 * @param id the salesman id
 * @returns {Promise<Salesman>} This method returns the requested salesman.
 */
exports.readOneSalesman = async function (orange, id) {
    //check for wrong or missing inputs
    helper_function.checkIfOneOrMoreParamsAreUndefined(orange, id, null, null);
    helper_function.checkForBadInput(id);

    //get the salesman
    let sm = await orange.getEmployeeInfo(id);

    //map the salesman to the salesman model and return him
    return new SalesmanService(parseInt(sm.code), sm.firstName, sm.lastName);
};

/**
 * This method adds a remark to an existing review.
 *
 * @param db the database
 * @param id the id of the salesman
 * @param year the year where the remark is given to salesman
 * @param remark the remark for the salesman
 * @returns {Promise<String>} This method returns the remark.
 */
exports.addRemark = async function (db, id, year, remark) {
    //check for wrong or missing inputs
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, year, remark);
    helper_function.checkForBadInput(id, year, remark);

    //try to get the order from db
    let orderDb = db.collection("review").findOne({salesman_id: parseInt(id), year: parseInt(year)});

    //check if the dbOrder is null or not - not null = continue; null = end
    let endOrContinue = orderDb === null;

    //message in case that no order with the given params exists
    let message = "NoElementFoundError: In the given Database exists no order with the id: " + id + " and the year: " + year + "!";

    //throw NoElementFoundError if order dont exists and continue if not
    if (endOrContinue) {
        throw new NoElementFoundError(message);
    } else {
        await db.collection("review").updateOne({salesman_id: parseInt(id), year: parseInt(year)}, {$set: {remarks : remark}});
    }
}

exports.renewOrder = async function (open, id, year, db) {
    let f = await db.collection('settings').findOne({name: "socialBonusFactor"});
    let b = await db.collection('settings').findOne({name: "socialBonusBase"});

    //get the entries
    let performance = await db.collection('records').findOne({id: parseInt(id), 'EvaluationRecord.year': parseInt(year)});
    let entries = [];
    let newEntries = [];
    if(performance){
        entries = performance.EvaluationRecord.entries;
        if (!entries) {
            newEntries = [];
        } else {
            entries.forEach(e => {
                newEntries.push({
                    name: e.name,
                    target: e.target,
                    actual: e.actual,
                    bonus: (f.value * 100 * e.actual / e.target + b.value * 100)
                });
            });
        }
    }

    let review = await db.collection("review").findOne({salesman_id: parseInt(id), year: parseInt(year)});
    if (review){
        await db.collection("review").deleteOne({salesman_id: parseInt(id), year: parseInt(year)});
    }
    await db.collection("review").insertOne(await open.getReview(id, year, db));
    await db.collection("review").updateOne({salesman_id: parseInt(id), year: parseInt(year)}, {$set: {performance : newEntries}});
    return db.collection("review").findOne({salesman_id: parseInt(id), year: parseInt(year)});
}

exports.getOrder = async function (open, id, year, db){
    let review = await db.collection("review").findOne({salesman_id: parseInt(id), year: parseInt(year)});

    if (review){
        return review;
    } else {
        return this.renewOrder(open, id, year, db);
    }
}

exports.getYearsOfOrders = async function(open, id){
    return open.getYearsOfOrders(id);
}

exports.approve = async function(db, id, year, group){
    let grouP = parseInt(group);
    if (grouP === 1){
        await db.collection('review').findOneAndUpdate({salesman_id: parseInt(id), year: parseInt(year)}, {$set: {salesmanApproved: true}});
    } else if(grouP === 2){
        await db.collection('review').findOneAndUpdate({salesman_id: parseInt(id), year: parseInt(year)}, {$set: {hrApproved: true}});
    } else {
        await db.collection('review').findOneAndUpdate({salesman_id: parseInt(id), year: parseInt(year)}, {$set: {managementApproved: true}});
    }
}
