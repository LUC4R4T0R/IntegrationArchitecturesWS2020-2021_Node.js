let evaluationRecord_service = require('./EvaluationRecord');
let NoElementFoundError = require('../custom_errors/NoElementFoundError');
let ElementDuplicateError = require('../custom_errors/ElementDuplicateError');
let EvaluationRecordEntry = require('../models/EvaluationRecordEntry');
let helper_function = require('./Help');

/**
 * This method inserts a record-entry into the database.
 *
 * @param db the database
 * @param id the id of the salesman the record-entry is for
 * @param year the year the record the entry is for was created
 * @param evaluationRecordEntry the entry that should be inserted into the db
 * @returns {Promise<void>} This method returns nothing.
 */
exports.createEvaluationRecordEntry = async function (db, id, year, evaluationRecordEntry) {
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, year, evaluationRecordEntry);
    helper_function.checkForBadInput(id, year, evaluationRecordEntry.name);
    await insert(db, id, year, evaluationRecordEntry);
};

/**
 * This method reads one entry from the database.
 *
 * @param db the database
 * @param id the id of the salesman the record-entry from
 * @param year the year of the record-entry
 * @param name
 * @returns {Promise<EvaluationRecordEntry>} This method returns one record-entry.
 */
exports.readOneEvaluationRecordEntry = async function (db, id, year, name) {
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, year, name);
    helper_function.checkForBadInput(id, year, name);
    return getOne(db, id, year, name);
};

/**
 * This method reads all entries from the database
 *
 * @param db the database
 * @param id the id of the salesman the record-entries are from
 * @param year the year of the record-entries
 * @returns {Promise<[EvaluationRecordEntry]>} This method returns all record-entries of one record.
 */
exports.readAllEvaluationRecordEntry = async function (db, id, year) {
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, year, null);
    helper_function.checkForBadInput(id);
    return getAll(db, id, year);
};


exports.updateEvaluationRecordEntry = async function (db, id, year, evaluationRecordEntry) {
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, year, evaluationRecordEntry);
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
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, year, name);
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
//create
async function insert(db, id, year, evaluationRecordEntry) {
    let allEntries = await getAllEntriesOfThisSalesmanInThisYear(db, id, year);
    if (doesThisEntryExists(allEntries, evaluationRecordEntry.name)) {
        throw new ElementDuplicateError("ElementDuplicateError: You tried to create an EvaluationRecordEntry that already exists!");
    } else {
        await insertIntoDb(db, allEntries, id, year, evaluationRecordEntry);
    }
}

function doesThisEntryExists(allEntries, name) {
    return allEntries.filter(x => x.name === name).length > 0;
}

async function insertIntoDb(db, allEntries, id, year, evaluationRecordEntry) {
    allEntries.push(evaluationRecordEntry);
    await updateTheRecord(db, id, year, allEntries);
}

//read one
function getOne(db, id, year, name) {
    return getTheEntry(db, id, year, name)
        .then(entry => {
            if (entry.length > 0) {
                return new EvaluationRecordEntry(entry[0].name, entry[0].target, entry[0].actual);
            } else {
                throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecordEntry with the name: " + name + " !");
            }
        });
}

function getTheEntry(db, id, year, name) {
    return evaluationRecord_service.readOneEvaluationRecord(db, id, year)
        .then(oneEntryForThisSalesmanInThisYear => {
            return oneEntryForThisSalesmanInThisYear.entries.filter(x => x.name === name);
        });
}

//read all
function getAll(db, id, year) {
    return evaluationRecord_service.readOneEvaluationRecord(db, id, year)
        .then(allEntriesForThisSalesmanInThisYear => {
            return allEntriesForThisSalesmanInThisYear.entries.map(
                entry => new EvaluationRecordEntry(entry.name, entry.target, entry.actual)
            );
        });
}

//update

//delete


//used multiple times
function getAllEntriesOfThisSalesmanInThisYear(db, id, year) {
    return evaluationRecord_service.readOneEvaluationRecord(db, id, year)
        .then((record) => {
            let entries = record.entries;
            if (entries === null) {
                return [];
            } else {
                return entries;
            }
        })
}

async function updateTheRecord(db, id, year, records) {
    let newRecordList = {
        $set: {
            "EvaluationRecord.year": parseInt(year),
            "EvaluationRecord.entries": records
        }
    };
    await db.collection("records").updateOne({
        id: parseInt(id),
        "EvaluationRecord.year": parseInt(year)
    }, newRecordList);
}
