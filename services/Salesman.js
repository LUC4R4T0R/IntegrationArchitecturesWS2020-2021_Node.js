//create Salesman
exports.createSalesman = async function (db, salesman) {
    if (db === undefined || salesman === undefined) {
        console.log("Expected Element");
        throw new Error;
    } else {
        let test = await db.collection("salesman").find({id: parseInt(salesman.id)}).toArray();
        if (test.length === 0) {
            await db.collection("salesman").insertOne(salesman);
        } else {
            console.log("Element already exists");
            throw new Error;
        }
    }
};

//read Salesman
exports.readSalesman = async function (db, id, query) {
    if (db === undefined) {
        console.log("Expected Element");
        throw new Error;
    } else {
        if (id === undefined && query === undefined) {
            let test = await db.collection("salesman").find({}).toArray();
            if (test.length === 0) {
                console.log("Element(s) not found");
                throw new Error;
            } else {
                //return all elements of the collection
                return test;
            }
        } else if (id === undefined) {
            let test = await db.collection("salesman").find(query).toArray();
            if (test.length === 0) {
                console.log("Element(s) not found");
                throw new Error;
            } else {
                //return all elements of the collection with have a specific firstname and/or lastname
                return test;
            }
        } else if (query === undefined) {
            let test = await db.collection("salesman").find({id: parseInt(id)}).toArray();
            if (test.length === 0) {
                console.log("Element(s) not found");
                throw new Error;
            } else {
                //return the element with the given id
                return test[0];
            }
        } else {
            console.log("To much params");
            throw new Error;
        }
    }
};

//update Salesman
exports.updateSalesman = async function (db, salesman) {
    if (db === undefined || salesman === undefined) {
        console.log("Expected Element");
        throw new Error;
    } else {
        let test = await db.collection("salesman").find({id: parseInt(salesman.id)}).toArray();
        if (test.length !== 0) {
            let new_values = {$set: {firstname: salesman.firstname, lastname: salesman.lastname}};
            await db.collection("salesman").updateOne({id: parseInt(salesman.id)}, new_values);
        } else {
            console.log("Element not found");
            throw new Error;
        }
    }

};

//delete Salesman
exports.deleteSalesman = async function (db, id) {
    if (db === undefined || id === undefined) {
        console.log("Expected Element");
        throw new Error;
    } else {
        let test = await db.collection("salesman").find({id: parseInt(id)}).toArray();
        if (test.length !== 0) {
            await db.collection("salesman").deleteOne({id: parseInt(id)});
        } else {
            console.log("Element not found");
            throw new Error;
        }
    }
};