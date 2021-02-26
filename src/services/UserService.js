const bcrypt = require('bcrypt');
let BadCredentialsError = require('../custom_errors/BadCredentialsError');
let ElementDuplicateError = require('../custom_errors/ElementDuplicateError');
let NoElementFoundError = require('../custom_errors/NoElementFoundError');
let helper_function = require('./Help');

/**
 * This method creates a new user.
 *
 * @param db the database
 * @param user the user to create
 * @returns {Promise<void>} This method returns that the user is added or throws an error.
 */
exports.createUser = async function (db, user) {
    //checks for missing input
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, user, null, null);

    //try to get this user from the db
    let userWithThisName = await db.collection("users").findOne({username: user.username});

    //if no such user exist insert him
    if (userWithThisName === null) {
        try {
            user.password = await bcrypt.hash(user.password, 10);
            await db.collection("users").insertOne(user);
        } catch (error) {
            throw new Error('Unable to hash password! ' + error);
        }
        //this user already exists
    } else {
        throw new ElementDuplicateError('ElementDuplicateError: A user with the given username already exists!');
    }
}

/**
 * This method reads all users from the database.
 *
 * @param db the database
 * @returns {Promise<[User]>} This method returns a list of all users.
 */
exports.readAllUsers = async function (db) {
    //check for missing input
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, null, null, null);

    //read all user from the database
    let allUsers = await db.collection('users').find().toArray();

    //return a list of all users if at least one user was found and throw an error in every other case
    if (!allUsers) {
        throw new NoElementFoundError('NoElementFoundError: No user was found!');
    } else {
        return allUsers.map(user => {
            if (user.employeeId) {
                return {
                    displayname: user.displayname,
                    username: user.username,
                    employeeId: user.employeeId,
                    group: user.group
                };
            } else {
                return {
                    displayname: user.displayname,
                    username: user.username,
                    group: user.group
                };
            }
        });
    }
}

/**
 * This method reads one specific user.
 *
 * @param db the database
 * @param username the name of the requested user
 * @returns {Promise<{displayname: *, employeeId: *, username: *, group: *}>} This method returns the requested user.
 */
exports.readOneUser = async function (db, username) {
    //check for missing input
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, username, null, null);

    //try to get the requested user
    let userWithThisName = await db.collection('users').findOne({username: username});

    //return the requested user or throws an error if no user with this username was found
    if (userWithThisName) {
        if (userWithThisName.employeeId) {
            return {
                displayname: userWithThisName.displayname,
                username: userWithThisName.username,
                employeeId: userWithThisName.employeeId,
                group: userWithThisName.group
            };
        } else {
            return {
                displayname: userWithThisName.displayname,
                username: userWithThisName.username,
                group: userWithThisName.group
            };
        }
    } else {
        throw new NoElementFoundError('NoElementFoundError: The specified user was not found!');

    }
}

/**
 * This method updates the user info.
 *
 * @param db the database
 * @param user the new infos
 * @returns {Promise<void>} This method returns nothing.
 */
exports.updateUser = async function (db, user) {
    //check for missing input
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, user, null, null);

    //try to get the requested user
    let userWithThisName = await db.collection("users").findOne({username: user.username});

    //update the user or throw an error if it did not work
    if (!userWithThisName) {
        throw new NoElementFoundError('NoElementFoundError: There is no user with this username!');
    } else {
        await db.collection('users').findOneAndUpdate({username: user.username}, {
            "$set": {
                displayname: user.displayname,
                employeeId: user.employeeId,
                group: user.group
            }
        });
    }
}

/**
 * This method updates the password of an user.
 *
 * @param db the database
 * @param username the username
 * @param oldPw the old password
 * @param newPw the new password
 * @returns {Promise<void>} This method returns nothing.
 */
exports.updateUserPW = async function (db, username, oldPw, newPw) {
    //check for missing input
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, username, oldPw, newPw);

    //try to get the requested user
    let userWithThisName = await db.collection("users").findOne({username: username});

    if (userWithThisName) {
        if (await bcrypt.compare(oldPw, userWithThisName.password)) {
            await db.collection('users').findOneAndUpdate(
                {username: username},
                {"$set": {password: await bcrypt.hash(newPw, 10)}});
        } else {
            throw new BadCredentialsError();
        }
    } else {
        throw new NoElementFoundError('NoElementFoundError: There is no user with this username!');
    }
}

/**
 * This method deletes an user.
 *
 * @param db the database
 * @param username the username
 * @returns {Promise<void>} This method returns nothing.
 */
exports.deleteUser = async function (db, username) {
    //check for missing input
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, username, null, null);

    //try to get the requested user
    let userWithThisName = await db.collection("users").findOne({username: username});

    //delete the user or throw an error if it did not work
    if (!userWithThisName) {
        throw new NoElementFoundError('NoElementFoundError: There is no user with this username!');
    } else {
        await db.collection('users').deleteOne({username: username});
    }
}

/**
 * This method verifies that this username and password is correct.
 *
 * @param db the database
 * @param username the username to verify
 * @param password the password to verify
 * @returns {Promise<void>} This method returns nothing.
 */
exports.verifyUser = async function (db, username, password) {
    //check for missing input
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, username, password, null);

    //get the user to check from the database
    let userWithThisName = await db.collection("users").findOne({username: username});

    //verify the the user or throw an error if the password is wrong or no user like this exists
    if (userWithThisName) {
        await bcrypt.compare(password, userWithThisName.password)
            .then((res) => {
                if (res === false) {
                    throw new BadCredentialsError();
                }
            });
    } else {
        throw new NoElementFoundError('NoElementFoundError: The given user is unknown!');
    }
}
