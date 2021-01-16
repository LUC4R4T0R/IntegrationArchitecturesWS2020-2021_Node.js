let NoElementFoundError = require('../custom_errors/NoElementFoundError');
let ElementDuplicateError = require('../custom_errors/ElementDuplicateError');
let EvaluationRecord = require('../models/EvaluationRecord');
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
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, evaluationRecord, null);
    helper_function.checkForBadInput(id);
    await insertRecord(db, id, evaluationRecord);
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
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, year, null);
    helper_function.checkForBadInput(id, year);
    return await getRecord(db, id, year);
};

/**
 * This method reads all records of the salesman with the given id from the database.
 *
 * @param db the database
 * @param id the id of the salesman we want the record of
 * @returns {Promise<[EvaluationRecord]>} This method returns all records with the given specs.
 */
exports.readAllEvaluationRecord = async function (db, id) {
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, null, null);
    helper_function.checkForBadInput(id);
    return await getRecords(db, id);
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
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, year, null);
    helper_function.checkForBadInput(id, year);
    await deleteRecord(db, id, year);
};

//-------------------------------------helper-------------------------------------------------------
//create
function insertRecord(db, id, evaluationRecord) {
    return executeCheckForDbOperation(db, id, evaluationRecord.year, tryToInsertIntoDb, evaluationRecord.entries);
}

function tryToInsertIntoDb(db, id, year, recordDontExist, entries) {
    let message = "ElementDuplicateError: You tried to create an EvaluationRecord that already exists!";
    return executeDbOperation(db, id, year, !recordDontExist, new ElementDuplicateError(message), insertRecordIntoDB, entries);
}

function insertRecordIntoDB(db, id, year, entries) {
    return db.collection("records").insertOne({
        id: id,
        EvaluationRecord: new EvaluationRecord(year, entries)
    });
}

//read one
function getRecord(db, id, year) {
    return executeCheckForDbOperation(db, id, year, tryToGetRecordFromDb);
}

function tryToGetRecordFromDb(db, id, year, itExists) {
    let message = "NoElementFoundError: In the given Database exists no EvaluationRecord with the id: " + id + " and the year: " + year + "!";
    return executeDbOperation(db, id, year, itExists, new NoElementFoundError(message), getTheRecordFromDb)
}

function getTheRecordFromDb(db, id, year) {
    return db.collection("records").findOne({
        id: id,
        "EvaluationRecord.year": year
    })
        .then(recordWithId => {
            let record = recordWithId.EvaluationRecord;
            return new EvaluationRecord(record.year, record.entries);
        });
}

//read all
function getRecords(db, id) {
    let {iD} = idAndYearToInt(id);
    return db.collection("records").find({id: iD}).toArray()
        .then(records => {
            return recordsWithoutSalesmanId(records);
        });
}

function recordsWithoutSalesmanId(records) {
    if (checkIfListEqualsZero(records)) {
        return [];
    } else {
        return mapRecordsToNorm(records);
    }
}

function checkIfListEqualsZero(list) {
    return list.length === 0;
}

function mapRecordsToNorm(records) {
    return records.map(record => {
        let evalRecord = record.EvaluationRecord;
        return new EvaluationRecord(evalRecord.year, evalRecord.entries);
    });
}

//delete
function deleteRecord(db, id, year) {
    return executeCheckForDbOperation(db, id, year, tryToDeleteRecordFromDb);
}

function tryToDeleteRecordFromDb(db, id, year, itExists) {
    let message = "NoElementFoundError: In the given Database exists no EvaluationRecord with the id: " + id + " and the year: " + year + "!";
    return executeDbOperation(db, id, year, itExists, new NoElementFoundError(message), deleteRecordFromDb)
}

function deleteRecordFromDb(db, id, year) {
    return db.collection("records").deleteOne({
        id: id,
        "EvaluationRecord.year": year
    });
}

//used multiple times
function executeCheckForDbOperation(db, id, year, func, entries){
    let {iD, yeaR} = idAndYearToInt(id, year);
    return checkIfThisRecordDontExist(db, iD, yeaR)
        .then(recordDontExist => {
            return func(db, iD, yeaR, recordDontExist, entries);
        });
}

function idAndYearToInt(id, year = "0"){
    return {
        iD: parseInt(id),
        yeaR: parseInt(year),
    };
}

function checkIfThisRecordDontExist(db, id, year) {
    return getTheRecord(db, id, year)
        .then((record) => {
            return record === null;
        });
}

function getTheRecord(db, id, year) {

    return db.collection("records").findOne({
        id: id,
        "EvaluationRecord.year": year
    });
}

function executeDbOperation(db, id, year, exist, error, func, entries){
    if (exist) {
        throw error;
    } else {
        return func(db, id, year, entries);
    }
}
