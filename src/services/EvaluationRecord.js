let NoElementFoundError = require('../custom_errors/NoElementFoundError');
let ElementDuplicateError = require('../custom_errors/ElementDuplicateError');
let BadInputError = require('../custom_errors/BadInputError');
let MissingElementError = require('../custom_errors/MissingElementError');
let EvaluationRecord = require('../models/EvaluationRecord');

exports.createEvaluationRecord = async function (db, id, evaluationRecord) {
    checkIfParamIsUndefined(db, id, null, evaluationRecord);
    checkForBadInput(id);
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
    checkIfParamIsUndefined(db, id);
    if (year !== undefined) { // get One EvaluationRecord
        checkForBadInput(id, year);
        if (await checkIfThisRecordDontExist(db, id, year)) {
            throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecord with the id: " + id + " and the year: " + year + "!");
        } else {
            return await recordWithoutTheSalesmanId(db, id, year);
        }
    } else { // get all EvaluationRecords for this Salesman
        checkForBadInput(id);
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
    checkIfParamIsUndefined(db, id, year);
    checkForBadInput(id, year);
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
//maybe global
function checkIfParamIsUndefined(db, id, year = null, evaluationRecord = null) {
    if (db === undefined || id === undefined || year === undefined || evaluationRecord === undefined) {
        throw new MissingElementError();
    }
}

function checkForBadInput(id, year = "0") {
    if (!id.match(/^[\d]+$/g) || !year.match(/^[\d]+$/g)) {
        throw new BadInputError();
    }
}


//...
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


//often
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
