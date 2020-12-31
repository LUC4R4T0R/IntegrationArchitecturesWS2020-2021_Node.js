let NoElementFoundError = require('../custom_errors/NoElementFoundError');
let ElementDuplicateError = require('../custom_errors/ElementDuplicateError');
let EvaluationRecord = require('../models/EvaluationRecord');
let helper_function = require('./Help');

exports.createEvaluationRecord = async function (db, id, evaluationRecord) {
    helper_function.checkIfParamIsUndefined(db, id, evaluationRecord,null);
    helper_function.checkForBadInput(id);

    if (await checkIfThisRecordDontExist(db, id, evaluationRecord.year)) {
        await db.collection("records").insertOne({
            id: parseInt(id),
            EvaluationRecord: evaluationRecord
        });
    } else {
        throw new ElementDuplicateError("ElementDuplicateError: You tried to create an EvaluationRecord that already exists!");
    }
};

exports.readEvaluationRecord = async function (db, id, year) {
    helper_function.checkIfParamIsUndefined(db, id,null,null);

    if (year !== undefined) { // get One EvaluationRecord
        helper_function.checkForBadInput(id, year);

        if (await checkIfThisRecordDontExist(db, id, year)) {
            throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecord with the id: " + id + " and the year: " + year + "!");
        } else {
            return await recordWithoutTheSalesmanId(db, id, year);
        }
    } else { // get all EvaluationRecords for this Salesman
        helper_function.checkForBadInput(id);
        let theRecordsThatAreRequested = await db.collection("records").find({id: parseInt(id)}).toArray();
        if (checkIfListEqualsZero(theRecordsThatAreRequested)) {
            throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecord with the id: " + id + "!");
        } else {
            return theRecordsThatAreRequested.map(record => {
                return new EvaluationRecord(record.EvaluationRecord.year, record.EvaluationRecord.entries);
            });
        }
    }
};

exports.deleteEvaluationRecord = async function (db, id, year) {
    helper_function.checkIfParamIsUndefined(db, id, year,null);
    helper_function.checkForBadInput(id, year);

    if (await checkIfThisRecordDontExist(db, id, year)) {
        throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecord with the id: " + id + " and the year: " + year + "!");
    } else {
        await db.collection("records").deleteOne({
            id: parseInt(id),
            "EvaluationRecord.year": parseInt(year)
        });
    }
};


//-------------------------------------helper-------------------------------------------------------
function recordWithoutTheSalesmanId(db, id, year) {
    return getTheRecord(db, id, year)
        .then((ret) => {
            return ret.EvaluationRecord;
        })
        .then((ret) => {
            return new EvaluationRecord(ret.year, ret.entries);
        });
}

function checkIfListEqualsZero(list) {
    return list.length === 0;
}


//used multiple times
function checkIfThisRecordDontExist(db, id, year) {
    return getTheRecord(db, id, year)
        .then((val) => {
            return val === null;
        });
}

function getTheRecord(db, id, year) {
    return db.collection("records").findOne({
        id: parseInt(id),
        "EvaluationRecord.year": parseInt(year)
    });
}
