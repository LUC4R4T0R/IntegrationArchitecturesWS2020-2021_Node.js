const bcrypt = require('bcrypt');
let BadCredentialsError = require('../custom_errors/BadCredentialsError');
let ElementDuplicateError = require('../custom_errors/ElementDuplicateError');
let NoElementFoundError = require('../custom_errors/NoElementFoundError');
let helper_function = require('./Help');

exports.createUser = async function (db, user) {
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, user, null, null);

    let userWithThisName = await db.collection("users").findOne({username: user.username});
    if (userWithThisName === null) {
        try {
            user.password = await bcrypt.hash(user.password, 10);
            await db.collection("users").insertOne(user);
            return "Added new User: " + user.displayname;
        } catch (e) {
            throw new Error('Unable to hash password! ' + e);
        }
    } else {
        throw new ElementDuplicateError('ElementDuplicateError: A user with the given username already exists!');
    }
}

exports.readUser = async function (db, username) {
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, null, null, null);

    if (username === undefined) { //all users
        let allUsers = await db.collection('users').find().toArray();
        if (allUsers === null) {
            throw new NoElementFoundError('NoElementFoundError: No user was found!');
        } else {
            return allUsers.map((user) => {
                return {displayname: user.displayname, username: user.username};
            });
        }
    } else { // one user
        let userWithThisName = await db.collection('users').findOne({username: username});
        if (userWithThisName !== null) {
            return {displayname: userWithThisName.displayname, username: userWithThisName.username};
        }
        throw new NoElementFoundError('NoElementFoundError: The specified user was not found!');
    }
}

exports.updateUser = async function (db, user) {
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, user, null, null);

    let userWithThisName = await db.collection("users").findOne({username: user.username});
    if (userWithThisName === null) {
        throw new NoElementFoundError('NoElementFoundError: There is no user with this username!');
    } else {
        await db.collection('users').findOneAndUpdate({username: user.username}, {"$set": {"displayname": user.displayname}});
    }
}

exports.deleteUser = async function (db, username) {
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, username, null, null);

    let userWithThisName = await db.collection("users").findOne({username: username});
    if (userWithThisName === null) {
        throw new NoElementFoundError('NoElementFoundError: There is no user with this username!');
    } else {
        await db.collection('users').deleteOne({username: username});
    }
}

exports.verifyUser = async function (db, username, password) {
    helper_function.checkIfOneOrMoreParamsAreUndefined(db, username, password, null);

    let userWithThisName = await db.collection("users").findOne({username: username});
    if (userWithThisName !== null) {
        await bcrypt.compare(password, userWithThisName.password).then((res) => {
            if (res === false) {
                throw new BadCredentialsError();
            }
        });
    } else {
        throw new NoElementFoundError('NoElementFoundError: The given user is unknown!');
    }

}
