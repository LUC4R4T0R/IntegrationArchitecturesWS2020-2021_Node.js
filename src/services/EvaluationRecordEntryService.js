let EvaluationRecordService = require('./EvaluationRecordService');
let NoElementFoundError = require('../custom_errors/NoElementFoundError');
let ElementDuplicateError = require('../custom_errors/ElementDuplicateError');
let EvaluationRecordEntryModel = require('../models/EvaluationRecordEntry');
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
    //check for wrong or missing inputs
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, year, evaluationRecordEntry);
    helper_function.checkForBadInput(id, year, evaluationRecordEntry.name);

    //get the record
    let record = await EvaluationRecordService.readOneEvaluationRecord(db, id, year);

    //get the entries
    let entries = await record.entries;
    if (!entries) {
        entries = [];
    }

    //check if entries already exists
    let doesThisEntryExists = entries.filter(x => x.name === evaluationRecordEntry.name).length > 0;

    //throw ElementDuplicateError if entry already exists and continue if not
    if (doesThisEntryExists) {
        throw new ElementDuplicateError("ElementDuplicateError: You tried to create an EvaluationRecordEntry that already exists!");
    } else {
        entries.push(evaluationRecordEntry);
        await updateTheRecord(db, id, year, entries);
    }
};

/**
 * This method reads all entries from the database
 *
 * @param db the database
 * @param id the id of the salesman the record-entries are from
 * @param year the year of the record-entries
 * @returns {Promise<[EvaluationRecordEntry]>} This method returns all record-entries of one record.
 */
exports.readAllEvaluationRecordEntries = async function (db, id, year) {
    //check for wrong or missing inputs
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, year, null);
    helper_function.checkForBadInput(id);

    //get all entries
    let entries = await getAllEntriesOfThisSalesmanInThisYear(db, id, year);

    //map the entries to the entry model
    entries = entries.map(
        entry => new EvaluationRecordEntryModel(entry.name, entry.target, entry.actual)
    );

    return entries;
};

/**
 * This method reads one entry from the database.
 *
 * @param db the database
 * @param id the id of the salesman the record-entry from
 * @param year the year of the record-entry
 * @param name name of the entry to read
 * @returns {Promise<EvaluationRecordEntry>} This method returns one record-entry.
 */
exports.readOneEvaluationRecordEntry = async function (db, id, year, name) {
    //check for wrong or missing inputs
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, year, name);
    helper_function.checkForBadInput(id, year, name);

    //get all entries
    let entries = await getAllEntriesOfThisSalesmanInThisYear(db, id, year);

    //get the entry
    let entry = entries.filter(x => x.name === name);

    //throw NoElementFoundError if no entry was found and continue if not
    if (entry.length > 0) {
        return new EvaluationRecordEntryModel(entry[0].name, entry[0].target, entry[0].actual);
    } else {
        throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecordEntry with the name: " + name + " !");
    }
};

/**
 * This method updates an entry.
 *
 * @param db the database
 * @param id the id of the salesman the record-entry is from
 * @param year the year of the record-entry
 * @param evaluationRecordEntry the new entry
 * @returns {Promise<void>} This method returns nothing.
 */
exports.updateEvaluationRecordEntry = async function (db, id, year, evaluationRecordEntry) {
    //check for wrong or missing inputs
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, year, evaluationRecordEntry);
    helper_function.checkForBadInput(id, year, evaluationRecordEntry.name);

    let entries = await getAllEntriesOfThisSalesmanInThisYear(db, id, year);

    //change the entry
    let changed = false;
    entries = entries.map(x => {
        if (x.name === evaluationRecordEntry.name) {
            changed = true;
            return evaluationRecordEntry;
        }
        return x;
    })

    //update the record if the entry was changed and throw an error in every other case
    if (changed) {
        await updateTheRecord(db, id, year, entries);
    } else {
        throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecordEntry (EvaluationRecord id: " + id + " ,year: " + year + ") with the name: " + evaluationRecordEntry.name + "!");
    }
};

/**
 * This method deletes an entry.
 *
 * @param db the database
 * @param id the id of the salesman the record-entry from
 * @param year the year of the record-entry
 * @param name name of the entry to delete
 * @returns {Promise<void>} This method returns nothing.
 */
exports.deleteEvaluationRecordEntry = async function (db, id, year, name) {
    //check for wrong or missing inputs
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, id, year, name);
    helper_function.checkForBadInput(id, year, name);

    //get all entries
    let allEntries = await getAllEntriesOfThisSalesmanInThisYear(db, id, year);

    //remove the entry to delete
    let entriesWithoutTheOneToDelete = allEntries.filter(x => x.name !== name);

    //update the record if an entry was deleted and throw an error in every other case
    if (entriesWithoutTheOneToDelete.length !== allEntries.length) {
        await updateTheRecord(db, id, year, entriesWithoutTheOneToDelete);
    } else {
        throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecordEntry (EvaluationRecord id: " + id + " ,year: " + year + ") with the name: " + name + "!");
    }
};

/**
 * This method gets all entries of an record.
 *
 * @param db the database
 * @param id the id of the salesman
 * @param year the year of the record
 * @returns {Promise<[EvaluationRecordEntry]>} This method returns a list of entries.
 */
function getAllEntriesOfThisSalesmanInThisYear(db, id, year) {
    return EvaluationRecordService.readOneEvaluationRecord(db, id, year)
        .then((record) => {
            let entries = record.entries;
            if (entries === null) {
                return [];
            } else {
                return entries;
            }
        })
}

/**
 * This method updates a record with the new entries.
 *
 * @param db the database
 * @param id the id of the salesman
 * @param year the year of the record
 * @param entries the new entries
 * @returns {Promise<void>} This method returns nothing.
 */
async function updateTheRecord(db, id, year, entries) {
    let newRecordList = {
        $set: {
            "EvaluationRecord.year": parseInt(year),
            "EvaluationRecord.entries": entries
        }
    };
    await db.collection("records").updateOne({
        id: parseInt(id),
        "EvaluationRecord.year": parseInt(year)
    }, newRecordList);
}
