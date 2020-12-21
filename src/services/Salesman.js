let NoElementFoundError = require('../custom_errors/NoElementFoundError');
let BadInputError = require('../custom_errors/BadInputError');
let MissingElementError = require('../custom_errors/MissingElementError');

//create Salesman
/*exports.createSalesman = async function (db, salesman) {
    if (db === undefined || salesman === undefined) {
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    }
    if (!salesman.id.match(/^[\d]+$/g)||!salesman.firstname.match(/^[\w]+$/g)||!salesman.lastname.match(/^[\w]+$/g)){
        throw new BadInputError("BadInputError: The id must be a numbers (example input: 1234) and the first and lastname must be at least a character (example input 'a')!");
    } else {
        let test = await db.collection("salesman").find({id: parseInt(salesman.id)}).toArray();
        if (test.length === 0) {
            await db.collection("salesman").insertOne(salesman);
        } else {
            throw new ElementDuplicateError("ElementDuplicateError: You tried to create a Salesman that already exists!");
        }
    }
};*/

//read Salesman
exports.readSalesman = async function (db, id, queryString) {
    if (db === undefined) {
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    } else {
        if (id === undefined && queryString === undefined) {
            let test = await db.collection("salesman").find({}).toArray();
            if (test.length === 0) {
                throw new NoElementFoundError("NoElementFoundError: In the given Database exists no Salesman");
            } else {
                //return all elements of the collection
                return test;
            }
        } else if (id === undefined) {
            if (!queryString.match(/^[\w]+$/g)){
                throw new BadInputError("BadInputError: The queryString must be at least a character (example input 'a')!");
            }
            let test1 = await db.collection("salesman").find({firstname: queryString}).toArray();
            let test2 = await db.collection("salesman").find({lastname: queryString}).toArray();
            if (test1.length === 0 && test2.length === 0) {
                throw new NoElementFoundError("NoElementFoundError: In the given Database exists no Salesman with the given first-/lastname!");
            } else {
                //return all elements of the collection with have a specific firstname and/or lastname
                return test1.push(...test2);
            }
        } else if (queryString === undefined) {
            if (!id.match(/^[\d]+$/g)){
                throw new BadInputError("BadInputError: The id must be a numbers (example input: 1234)!");
            }
            let test = await db.collection("salesman").find({id: parseInt(id)}).toArray();
            if (test.length === 0) {
                throw new NoElementFoundError("NoElementFoundError: In the given Database exists no Salesman with the id: "+id+"!");
            } else {
                //return the element with the given id
                return test[0];
            }
        }
    }
};

//update Salesman
/*exports.updateSalesman = async function (db, salesman) {
    if (db === undefined || salesman === undefined) {
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    }
     if (!salesman.id.match(/^[\d]+$/g)||!salesman.firstname.match(/^[\w]+$/g)||!salesman.lastname.match(/^[\w]+$/g)){
        throw new BadInputError("BadInputError: The id must be a numbers (example input: 1234) and the first and lastname must be at least a character (example input 'a')!");
    } else {
        let test = await db.collection("salesman").find({id: parseInt(salesman.id)}).toArray();
        if (test.length !== 0) {
            let new_values = {$set: {firstname: salesman.firstname, lastname: salesman.lastname}};
            await db.collection("salesman").updateOne({id: parseInt(salesman.id)}, new_values);
        } else {
            throw new NoElementFoundError("NoElementFoundError: In the given Database exists no Salesman with the id: "+salesman.id+"!");
        }
    }

};*/

//delete Salesman
/*exports.deleteSalesman = async function (db, id) {
    if (db === undefined || id === undefined) {
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    }
     if (!salesman.id.match(/^[\d]+$/g)){
        throw new BadInputError("BadInputError: The id must be a numbers (example input: 1234)!");
    } else {
        let test = await db.collection("salesman").find({id: parseInt(id)}).toArray();
        if (test.length !== 0) {
            await db.collection("salesman").deleteOne({id: parseInt(id)});
        } else {
            throw new NoElementFoundError("NoElementFoundError: In the given Database exists no Salesman with the id: "+id+"!");
        }
    }
};*/
