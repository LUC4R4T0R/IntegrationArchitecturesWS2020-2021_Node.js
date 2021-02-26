const NoElementFoundError = require("../custom_errors/NoElementFoundError");
const helper_function = require("./Help");

/**
 * This method reads one setting from the database.
 *
 * @param db the database
 * @param name the name of the setting
 * @returns {Promise<String>} This method returns the requested setting.
 */
exports.getSetting = async function (db, name) {
    //checks for missing input
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, name, null, null);

    //find the setting in the database
    let value = await db.collection('settings').findOne({name: name});

    //return the setting if it exists and throw an error in every other case
    if (!value) {
        throw new NoElementFoundError("NoElementFoundError: In the given Database no setting exists with the name: " + name + "!");
    } else {
        return value;
    }
}

/**
 * This method updates a setting.
 *
 * @param db the database
 * @param setting the new setting
 * @returns {Promise<void>} This method returns nothing.
 */
exports.setSetting = async function (db, setting) {
    //checks for missing input
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, setting, null, null);

    //check if this setting exists and edit it or throw in error if it doesn't exists
    if (await db.collection('settings').findOne({name: setting.name})) {
        await db.collection('settings').findOneAndUpdate({name: setting.name}, {'$set': {value: setting.value}});
    } else {
        throw new NoElementFoundError("NoElementFoundError: In the given Database exists no setting with the name: " + setting.name + "!");
    }
}
