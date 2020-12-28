const bcrypt = require('bcrypt');
let BadCredentialsError = require('../custom_errors/BadCredentialsError');
let BadInputError = require('../custom_errors/BadInputError');
let ElementDuplicateError = require('../custom_errors/ElementDuplicateError');
let NoElementFoundError = require('../custom_errors/NoElementFoundError');

exports.addUser = async function (db, user) {
    if (db === undefined || user === undefined) {
        throw new BadInputError();
    } else {
        let test = await db.collection("users").find({username: user.username}).toArray();
        if (test.length === 0) {
            bcrypt.hash(user.password, 10).then(async function (pwHash) {
                user.password = pwHash;
                await db.collection("users").insertOne(user);
                return "Added new User: " + user.displayname;
            }).catch((err) => {
                throw new Error('Unable to hash password!');
            });
        } else {
            throw new ElementDuplicateError('ElementDuplicateError: A user with the given username already exists!');
        }
    }
}

exports.listUsers = async function (db) {
    let users = await db.collection('users').find();
    return users.map((user) => {
        return {displayname: user.displayname, username: user.username};
    });
}

exports.getUser = async function (db, username) {
    let user = await db.collection('users').findOne({username: username});
    if (user != null && user !== undefined) {
        return {displayname: user.displayname, username: user.username};
    }
    throw new NoElementFoundError('NoElementFoundError: The specified user was not found!');
}

exports.updateUser = async function (db, user) {
    await db.collection('users').findOneAndUpdate({username: user.username}, {"$set": {"displayname": user.displayname}});
}

exports.deleteUser = async function (db, username) {
    await db.collection('users').deleteOne({username: username});
}

exports.verifyUser = async function (db, username, password) {
    if (db === undefined || username === undefined || password === undefined) {
        throw new BadInputError();
    } else {
        let user = await db.collection("users").findOne({username: username});
        if (user !== undefined && user !== null) {
            await bcrypt.compare(password, user.password).then((res) => {
                if (res === false) {
                    throw new BadCredentialsError();
                }
            });
        } else {
            throw new NoElementFoundError('NoElementFoundError: The given user is unknown!');
        }
    }
}