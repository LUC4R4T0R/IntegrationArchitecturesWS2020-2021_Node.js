const bcrypt = require('bcrypt');
let MissingElementError = require('../custom_errors/MissingElementError');
let BadCredentialsError = require('../custom_errors/BadCredentialsError');
let BadInputError = require('../custom_errors/BadInputError');
let ElementDuplicateError = require('../custom_errors/ElementDuplicateError');
let NoElementFoundError = require('../custom_errors/NoElementFoundError');

exports.addUser = async function(db, user){
    if (db === undefined || user === undefined) {
        throw new BadInputError();
    } else {
        let test = await db.collection("users").find({username: user.username}).toArray();
        if (test.length === 0) {
            bcrypt.hash(user.password, 10).then(async function(pwHash){
                user.password = pwHash;
                await db.collection("users").insertOne(user);
                console.log("Added new User: "+user.displayname);
            }).catch((err) => {
                console.error('Unable to hash password!');
                throw new Error;
            });
        } else {
            throw new ElementDuplicateError('ElementDuplicateError: A user with the given username already exists!');
        }
    }
}

exports.listUsers = async function(db){
    let users = await db.collection('users').find();
    return users.map((user) => {
        return {displayname: user.displayname, username: user.username};
    });
}

exports.getUser = async function(db, username){
    let user = await db.collection('users').findOne({username: username});
    if(user != null && user != undefined){
       return {displayname: user.displayname, username: user.username};
    }
    throw new NoElementFoundError('NoElementFoundError: The specified user was not found!');
}

/*exports.updateUser(db, user){

}*/

exports.deleteUser = async function(db, username){
    await db.collection('users').deleteOne({username: username});
}

exports.verifyUser = async function(db, username, password){
    if (db === undefined || username === undefined || password === undefined) {
        throw new BadInputError('BadInputError: The provided credentials are not complete!');
    } else {
        let user = await db.collection("users").findOne({username: username});
        if (user !== undefined && user !== null) {
            await bcrypt.compare(password, user.password).then( (res) => {
                if(res === false) {
                    throw new BadCredentialsError();
                }
            });
        } else {
            throw new MissingElementError('MissingElementError: The given user is unknown!');
        }
    }
}