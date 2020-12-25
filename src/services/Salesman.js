let NoElementFoundError = require('../custom_errors/NoElementFoundError');
let BadInputError = require('../custom_errors/BadInputError');
let MissingElementError = require('../custom_errors/MissingElementError');

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
