let NoElementFoundError = require('../custom_errors/NoElementFoundError');
let ElementDuplicateError = require('../custom_errors/ElementDuplicateError');
let EvaluationRecordService = require('../models/EvaluationRecord');
let helper_function = require('./Help');

/**
 * This Method inserts a record into the database.
 *
 * @param db the database
 * @param id the id of the salesman the record is for
 * @param evaluationRecord the record (year and entries) that should be inserted into the db
 * @returns {Promise<void>} This method returns nothing.
 */
exports.createEvaluationRecord = async function (db, id, evaluationRecord) {
    //check for wrong or missing inputs
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, evaluationRecord, null);
    helper_function.checkForBadInput(id);

    //change type of id and year from String to int
    let {iD} = idAndYearToInt(id);

    //try to get the record from DB
    let dbRecord = await db.collection("records").findOne({id: iD, "EvaluationRecord.year": evaluationRecord.year});

    //check if the dbRecord is null or not - false = end; true = continue
    let continueOrEnd = dbRecord !== null;

    //message in case that the record already exists
    let message = "ElementDuplicateError: You tried to create an EvaluationRecord that already exists!";

    //throw ElementDuplicateError if record already exists and continue if not
    if (continueOrEnd) {
        throw new ElementDuplicateError(message);
    } else {
        return db.collection("records").insertOne({id: iD, EvaluationRecord: new EvaluationRecordService(evaluationRecord.year, evaluationRecord.entries)});
    }
};


/**
 * This method reads the record of the salesman with the given id and in the the given year from the database.
 *
 * @param db the database
 * @param id the id of the salesman we want the record of
 * @param year the year the record was created
 * @returns {Promise<EvaluationRecord>} This method returns one record with the given specs.
 */
exports.readOneEvaluationRecord = async function (db, id, year) {
    //check for wrong or missing inputs
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, year, null);
    helper_function.checkForBadInput(id, year);

    //change type of id and year from String to int
    let {iD, yeaR} = idAndYearToInt(id, year);

    //try to get the record from DB
    let dbRecord = await db.collection("records").findOne({id: iD, "EvaluationRecord.year": yeaR});

    //check if the dbRecord is null or not - not null = continue; null = end
    let endOrContinue = dbRecord === null;

    //message in case that the record no record with the given params exists
    let message = "NoElementFoundError: In the given Database exists no EvaluationRecord with the id: " + id + " and the year: " + year + "!";

    //throw NoElementFoundError if record dont exists and continue if not
    if (endOrContinue) {
        throw new NoElementFoundError(message);
    } else {
        let record = dbRecord.EvaluationRecord;
        return new EvaluationRecordService(record.year, record.entries);
    }
};

/**
 * This method reads all records of the salesman with the given id from the database.
 *
 * @param db the database
 * @param id the id of the salesman we want the record of
 * @returns {Promise<[EvaluationRecord]>} This method returns all records with the given specs.
 */
exports.readAllEvaluationRecord = async function (db, id) {
    //check for wrong or missing inputs
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, null, null);
    helper_function.checkForBadInput(id);

    //change type of id and year from String to int
    let {iD} = idAndYearToInt(id);

    //get all records for this salesman
    let records = await db.collection("records").find({id: iD}).toArray();

    //if no records where found return an empty list, else map the found records to the EvaluationRecord model and return the result
    if(records.length === 0){
        return [];
    } else {
        return records.map(record => {
            let evalRecord = record.EvaluationRecord;
            return new EvaluationRecordService(evalRecord.year, evalRecord.entries);
        });
    }
};

/**
 * This method deletes the record of the salesman with the given id and of the given year from the database.
 *
 * @param db the database
 * @param id the id of the salesman we want to delete the record of
 * @param year the year of the record we want to delete
 * @returns {Promise<void>} This method returns nothing.
 */
exports.deleteEvaluationRecord = async function (db, id, year) {
    //check for wrong or missing inputs
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, year, null);
    helper_function.checkForBadInput(id, year);

    //change type of id and year from String to int
    let {iD, yeaR} = idAndYearToInt(id, year);

    //try to get the record from DB
    let dbRecord = await db.collection("records").findOne({id: iD, "EvaluationRecord.year": yeaR});

    //check if the dbRecord is null or not - not null = continue; null = end
    let endOrContinue = dbRecord === null;

    //message in case that no record with the given params exists
    let message = "NoElementFoundError: In the given Database exists no EvaluationRecord with the id: " + id + " and the year: " + year + "!";

    //throw NoElementFoundError if record dont exists and continue if not
    if (endOrContinue) {
        throw new NoElementFoundError(message);
    } else {
        return db.collection("records").deleteOne({id: iD, "EvaluationRecord.year": yeaR});
    }
};

/**
 * This method changes the type of id and year from String to int.
 *
 * @param id the id of the salesman
 * @param year the year of the record
 * @returns {{yeaR: number, iD: number}} The method return the id and year as an Integer.
 */
function idAndYearToInt(id, year = "0") {
    return {
        iD: parseInt(id),
        yeaR: parseInt(year),
    };
}
