let evaluationrecord_service = require('./EvaluationRecord');
let NoElementFoundError = require('../custom_errors/NoElementFoundError');
let ElementDuplicateError = require('../custom_errors/ElementDuplicateError');
let BadInputError = require('../custom_errors/BadInputError');
let MissingElementError = require('../custom_errors/MissingElementError');
let EvaluationRecordEntry = require('../models/EvaluationRecordEntry');

//create EvaluationRecordentry
exports.createEvaluationRecordEntry = async function (db, id, year, evaluationrecordentry) {
    if (db === undefined || id === undefined || year === undefined || evaluationrecordentry === undefined) {
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    }
    if (!id.match(/^[\d]+$/g) || !year.match(/^[\d]+$/g) || !evaluationrecordentry.name.match(/^[\w]+$/g)) {
        throw new BadInputError("BadInputError: The id and year must be numbers (example input: 1234) and the name must be at least a character (example input 'a')!");
    } else {
        //get the record-entries
        let evaluationRecord1 = await evaluationrecord_service.readEvaluationRecord(db, id, year);
        let list = evaluationRecord1.entries;

        if (list.filter(x => x.name === evaluationrecordentry.name).length > 0) { //check if name already exists
            throw new ElementDuplicateError("ElementDuplicateError: You tried to create an EvaluationRecordEntry that already exists!");
        } else {
            //add the entry and update the record
            list.push(evaluationrecordentry);
            let newvalues = {
                $set: {
                    "EvaluationRecord.year": parseInt(year),
                    "EvaluationRecord.entries": list
                }
            };
            await db.collection("records").updateOne({
                id: parseInt(id),
                "EvaluationRecord.year": parseInt(year)
            }, newvalues);
        }
    }
};

//read EvaluationRecordentry
exports.readEvaluationRecordEntry = async function (db, id, year, name) {
    if (db === undefined || id === undefined || year === undefined) {
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    } else {
        if (name === undefined) {
            if (!id.match(/^[\d]+$/g)) {
                throw new BadInputError("BadInputError: The id and year must be numbers (example input: 1234)!");
            }
            //get all entries of one id-year combination
            let evaluationRecord1 = await evaluationrecord_service.readEvaluationRecord(db, id, year);
            return evaluationRecord1.entries.map(entry => new EvaluationRecordEntry(entry.name, entry.target, entry.actual));
        } else {
            if (!id.match(/^[\d]+$/g) || !year.match(/^[\d]+$/g) || !name.match(/^[\w]+$/g)) {
                throw new BadInputError("BadInputError: The id and year must be numbers (example input: 1234) and the name must be at least a character (example input 'a')!");
            }
            //get one entry of one id-year combination
            let evaluationRecord1 = await evaluationrecord_service.readEvaluationRecord(db, id, year);
            let entry = evaluationRecord1.entries.filter(x => x.name === name);
            if(entry.length > 0) return new EvaluationRecordEntry(entry[0].name, entry[0].target, entry[0].actual);
            else throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecordEntry with the name: " + name + " !");
        }
    }
};

//update EvaluationRecordentry
exports.updateEvaluationRecordEntry = async function (db, id, year, evaluationrecordentry) {
    if (db === undefined || id === undefined || year === undefined || evaluationrecordentry === undefined) {
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    }
    if (!id.match(/^[\d]+$/g) || !year.match(/^[\d]+$/g) || !evaluationrecordentry.name.match(/^[\w]+$/g)) {
        throw new BadInputError("BadInputError: The id and year must be numbers (example input: 1234) and the name must be at least a character (example input 'a')!");
    } else {
        //get the record-entries
        let evaluationRecord1 = await evaluationrecord_service.readEvaluationRecord(db, id, year);
        let list = evaluationRecord1.entries;

        let changed = false;
        list = list.map(x => {
            if(x.name === evaluationrecordentry.name){
                changed = true;
                return evaluationrecordentry;
            }
            return x;
        })

        if (changed) {
            //update records with new entries
            let newvalues = {
                $set: {
                    "EvaluationRecord.year": parseInt(year),
                    "EvaluationRecord.entries": list
                }
            };
            await db.collection("records").updateOne({
                id: parseInt(id),
                "EvaluationRecord.year": parseInt(year)
            }, newvalues);
        } else {
            throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecordEntry (EvaluationRecord id: " + id + " ,year: " + year + ") with the name: " + evaluationrecordentry.name + "!");
        }
    }
};

//delete EvaluationRecordentry
exports.deleteEvaluationRecordEntry = async function (db, id, year, name) {
    if (db === undefined || id === undefined || year === undefined) {
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    }
    if (!id.match(/^[\d]+$/g) || !year.match(/^[\d]+$/g) || !name.match(/^[\w]+$/g)) {
        throw new BadInputError("BadInputError: The id and year must be numbers (example input: 1234) and the name must be at least a character (example input 'a')!");
    } else {
        //get the record-entries
        let evaluationRecord1 = await evaluationrecord_service.readEvaluationRecord(db, id, year);
        let list = evaluationRecord1.entries;

        //filter out the entry to delete it
        let newentries = list.filter(x => x.name !== name);

        if (newentries.length !== list.length) {
            //update records with new entries
            let newvalues = {
                $set: {
                    "EvaluationRecord.year": parseInt(year),
                    "EvaluationRecord.entries": newentries
                }
            };
            await db.collection("records").updateOne({
                id: parseInt(id),
                "EvaluationRecord.year": parseInt(year)
            }, newvalues);
        } else {
            throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecordEntry (EvaluationRecord id: " + id + " ,year: " + year + ") with the name: " + name + "!");
        }
    }
};
