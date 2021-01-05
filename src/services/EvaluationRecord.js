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
    await insert(db, id, evaluationRecord);
};

/**
 * This method reads the record of the salesman with the given id and in the the given year from the database.
 *
 * @param db the database
 * @param id the id of the salesman we want the record of
 * @param year the year the record was created
 * @returns {Promise<*>} This method returns one record with the given specs.
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
 * @returns {Promise<*|*[]|*>} This method returns all records with the given specs.
 */
exports.readAllEvaluationRecord = async function (db, id) {
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, null, null);
    helper_function.checkForBadInput(id);
    let records = await getRecords(db, id);
    return recordsWithoutSalesmanId(records);
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
async function insert(db, id, evaluationRecord) {
    let recordDontExist = await checkIfThisRecordDontExist(db, id, evaluationRecord.year)
    if (recordDontExist) {
        await insertIntoDB(db, id, evaluationRecord);
    } else {
        throw new ElementDuplicateError("ElementDuplicateError: You tried to create an EvaluationRecord that already exists!");
    }
}

async function insertIntoDB(db, id, evaluationRecord) {
    await db.collection("records").insertOne({
        id: parseInt(id),
        EvaluationRecord: new EvaluationRecord(parseInt(evaluationRecord.year), evaluationRecord.entries)
    });
}

//read one
async function getRecord(db, id, year) {
    if (await checkIfThisRecordDontExist(db, id, year)) {
        throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecord with the id: " + id + " and the year: " + year + "!");
    } else {
        let record = getTheRecordFromDb(db, id, year);
        return await recordWithoutSalesmanId(record);
    }
}

function getTheRecordFromDb(db, id, year) {
    return db.collection("records").findOne({
        id: parseInt(id),
        "EvaluationRecord.year": parseInt(year)
    });
}

function recordWithoutSalesmanId(recordPromise) {
    return recordPromise
        .then((recordWithIdAndRecord) => {
            return recordWithIdAndRecord.EvaluationRecord;
        })
        .then((record) => {
            return new EvaluationRecord(record.year, record.entries);
        });
}

//read all
function getRecords(db, id) {
    return db.collection("records").find({id: parseInt(id)}).toArray();
}

function recordsWithoutSalesmanId(records) {
    if (checkIfListEqualsZero(records)) {
        return [];
    } else {
        return records.map(record => {
            return new EvaluationRecord(record.EvaluationRecord.year, record.EvaluationRecord.entries);
        });
    }
}

function checkIfListEqualsZero(list) {
    return list.length === 0;
}

//delete
async function deleteRecord(db, id, year) {
    if (await checkIfThisRecordDontExist(db, id, year)) {
        throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecord with the id: " + id + " and the year: " + year + "!");
    } else {
        await deleteRecordFromDb(db, id, year);
    }
}

function deleteRecordFromDb(db, id, year) {
    return db.collection("records").deleteOne({
        id: parseInt(id),
        "EvaluationRecord.year": parseInt(year)
    });
}

//used multiple times
function checkIfThisRecordDontExist(db, id, year) {
    return getTheRecordFromDb(db, id, year)
        .then((record) => {
            return record === null;
        });
}
