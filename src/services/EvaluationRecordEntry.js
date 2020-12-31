let evaluationRecord_service = require('./EvaluationRecord');
let NoElementFoundError = require('../custom_errors/NoElementFoundError');
let ElementDuplicateError = require('../custom_errors/ElementDuplicateError');
let EvaluationRecordEntry = require('../models/EvaluationRecordEntry');
let helper_function = require('./Help');

exports.createEvaluationRecordEntry = async function (db, id, year, evaluationRecordEntry) {
    helper_function.checkIfParamIsUndefined(db, id, year, evaluationRecordEntry);
    helper_function.checkForBadInput(id, year, evaluationRecordEntry.name);

    let allEntries = await getAllEntriesOfThisSalesmanInThisYear(db, id, year);
    if (allEntries.filter(x => x.name === evaluationRecordEntry.name).length > 0) {
        throw new ElementDuplicateError("ElementDuplicateError: You tried to create an EvaluationRecordEntry that already exists!");
    } else {
        allEntries.push(evaluationRecordEntry);
        await updateTheRecord(db, id, year, allEntries);
    }
};

exports.readEvaluationRecordEntry = async function (db, id, year, name) {
    helper_function.checkIfParamIsUndefined(db, id, year, null);

    if (name === undefined) {
        helper_function.checkForBadInput(id);

        let allEntriesForThisSalesmanInThisYear = await evaluationRecord_service.readEvaluationRecord(db, id, year);
        return allEntriesForThisSalesmanInThisYear.entries.map(entry => new EvaluationRecordEntry(entry.name, entry.target, entry.actual));
    } else {
        helper_function.checkForBadInput(id, year, name);

        let oneEntryForThisSalesmanInThisYear = await evaluationRecord_service.readEvaluationRecord(db, id, year);
        let entry = oneEntryForThisSalesmanInThisYear.entries.filter(x => x.name === name);
        if (entry.length > 0) {
            return new EvaluationRecordEntry(entry[0].name, entry[0].target, entry[0].actual);
        } else {
            throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecordEntry with the name: " + name + " !");
        }
    }
};

exports.updateEvaluationRecordEntry = async function (db, id, year, evaluationRecordEntry) {
    helper_function.checkIfParamIsUndefined(db, id, year, evaluationRecordEntry);
    helper_function.checkForBadInput(id, year, evaluationRecordEntry.name);

    let allEntries = await getAllEntriesOfThisSalesmanInThisYear(db, id, year);
    let changed = false;
    allEntries = allEntries.map(x => {
        if (x.name === evaluationRecordEntry.name) {
            changed = true;
            return evaluationRecordEntry;
        }
        return x;
    })
    if (changed) {
        await updateTheRecord(db, id, year, allEntries);
    } else {
        throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecordEntry (EvaluationRecord id: " + id + " ,year: " + year + ") with the name: " + evaluationRecordEntry.name + "!");
    }
};

exports.deleteEvaluationRecordEntry = async function (db, id, year, name) {
    helper_function.checkIfParamIsUndefined(db, id, year, name);
    helper_function.checkForBadInput(id, year, name);

    let allEntries = await getAllEntriesOfThisSalesmanInThisYear(db, id, year);
    let entriesWithoutTheOneToDelete = allEntries.filter(x => x.name !== name);
    if (entriesWithoutTheOneToDelete.length !== allEntries.length) {
        await updateTheRecord(db, id, year, entriesWithoutTheOneToDelete);
    } else {
        throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecordEntry (EvaluationRecord id: " + id + " ,year: " + year + ") with the name: " + name + "!");
    }
};


//-------------------------------------helper-------------------------------------------------------
function getAllEntriesOfThisSalesmanInThisYear(db, id, year) {
    return evaluationRecord_service.readEvaluationRecord(db, id, year)
        .then((res) => {
            let ret = res.entries;
            if (ret === null) {
                return [];
            } else {
                return ret;
            }
        })
}


//used multiple times
async function updateTheRecord(db, id, year, list) {
    let newValues = {
        $set: {
            "EvaluationRecord.year": parseInt(year),
            "EvaluationRecord.entries": list
        }
    };
    await db.collection("records").updateOne({
        id: parseInt(id),
        "EvaluationRecord.year": parseInt(year)
    }, newValues);
}
