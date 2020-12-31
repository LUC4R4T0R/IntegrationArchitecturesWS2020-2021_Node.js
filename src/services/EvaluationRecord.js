let NoElementFoundError = require('../custom_errors/NoElementFoundError');
let ElementDuplicateError = require('../custom_errors/ElementDuplicateError');
let BadInputError = require('../custom_errors/BadInputError');
let MissingElementError = require('../custom_errors/MissingElementError');
let EvaluationRecord = require('../models/EvaluationRecord');

//create EvaluationRecord
exports.createEvaluationRecord = async function (db, id, evaluationRecord) {
    if (db === undefined || id === undefined || evaluationRecord === undefined) {
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    }
    if (!id.match(/^[\d]+$/g)) {
        throw new BadInputError();
    } else {
        let test = await db.collection("records").find({
            id: parseInt(id),
            "EvaluationRecord.year": parseInt(evaluationRecord.year)
        }).toArray();
        if (test.length === 0) {
            await db.collection("records").insertOne({
                id: parseInt(id),
                EvaluationRecord: evaluationRecord
            });
        } else {
            throw new ElementDuplicateError("ElementDuplicateError: You tried to create an EvaluationRecord that already exists!");
        }
    }
};

//read EvaluationRecord
exports.readEvaluationRecord = async function (db, id, year) {
    if (db === undefined || id === undefined) {
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    } else {
        if (year !== undefined) {
            if (!id.match(/^[\d]+$/g) || !year.match(/^[\d]+$/g)) {
                throw new BadInputError();
            }
            let test1 = await db.collection("records").findOne({
                id: parseInt(id),
                "EvaluationRecord.year": parseInt(year)
            });
            if (test1 === null) {
                throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecord with the id: " + id + " and the year: " + year + "!");
            } else {
                //return the record of the given salesman in the given year
                let rec = test1.EvaluationRecord;
                return new EvaluationRecord(rec.year, rec.entries);
            }
        } else {
            if (!id.match(/^[\d]+$/g)) {
                throw new BadInputError();
            }
            let test = await db.collection("records").find({id: parseInt(id)}).toArray();
            if (test.length === 0) {
                throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecord with the id: " + id + "!");
            } else {
                //return all records of this salesman
                return test.map(rec => {
                    return new EvaluationRecord(rec.EvaluationRecord.year, rec.EvaluationRecord.entries);
                });
            }
        }
    }
};

//delete EvaluationRecord
exports.deleteEvaluationRecord = async function (db, id, year) {
    if (db === undefined || id === undefined || year === undefined) {
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    }
    if (!id.match(/^[\d]+$/g) || !year.match(/^[\d]+$/g)) {
        throw new BadInputError("BadInputError: The id and year must be numbers (example input: 1234)");
    } else {
        let test = await db.collection("records").find({
            id: parseInt(id),
            "EvaluationRecord.year": parseInt(year)
        }).toArray();
        if (test.length !== 0) {
            await db.collection("records").deleteOne({
                id: parseInt(id),
                "EvaluationRecord.year": parseInt(year)
            });
        } else {
            throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecord with the id: " + id + " and the year: " + year + "!");
        }
    }

};
