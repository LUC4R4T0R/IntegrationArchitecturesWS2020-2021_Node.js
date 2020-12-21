const bcrypt = require('bcrypt');

exports.addUser = async function(db, user){
    if (db === undefined || user === undefined) {
        console.log("Expected Element");
        throw new Error;
    } else {
        console.log(user);
        let test = await db.collection("users").find({username: user.username}).toArray();
        if (test.length === 0) {
            bcrypt.hash(user.password, 10).then(async function(pwHash){
                user.password = pwHash;
                console.log(pwHash);
                await db.collection("users").insertOne(user);
                console.log("Added new User: "+user.displayname);
            }).catch((err) => {
                console.error('Unable to hash password!');
                throw new Error;
            });
        } else {
            console.log("User already exists");
            throw new Error;
        }
    }
}

exports.verifyUser = async function(db, username, password){
    console.log(password);
    if (db === undefined || username === undefined || password === undefined) {
        console.log("Expected Element");
        throw new Error;
    } else {
        let user = await db.collection("users").findOne({username: username});
        if (user !== undefined) {
            console.log(user);
            await bcrypt.compare(password, user.password).then( (res) => {
                if(res === false) {
                    console.log("Password was not correct!");
                    throw new Error;
                }
            });
        } else {
            console.log("User does not exist");
            throw new Error;
        }
    }
}