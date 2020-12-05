//create Salesman
exports.createSalesman = async function (db, salesman) {
    if (db === undefined || salesman === undefined) {
        console.log("Expected Element");
    } else {
        let test = await db.collection("salesman").find({id: parseInt(salesman.id)}).toArray();
        if (test.length === 0) {
            await db.collection("salesman").insertOne(salesman);
        } else {
            console.log("Element already exists");
        }
    }
};

//read Salesman
exports.readSalesman = async function (db, id, query) {
    if (db === undefined) {
        console.log("Expected Element");
    } else {
        if (id === undefined && query === undefined) {
            let test = await db.collection("salesman").find({}).toArray();
            if (test.length === 0) {
                console.log("Element(s) not found");
            } else {
                //return all elements of the collection
                return test;
            }
        } else if (id === undefined) {
            let test = await db.collection("salesman").find(query).toArray();
            if (test.length === 0) {
                console.log("Element(s) not found");
            } else {
                //return all elements of the collection with have a specific firstname and/or lastname
                return test;
            }
        } else if (query === undefined) {
            let test = await db.collection("salesman").find({id: parseInt(id)}).toArray();
            if (test.length === 0) {
                console.log("Element(s) not found");
            } else {
                //return the element with the given id
                return test[0];
            }
        } else {
            console.log("To much params");
        }
    }
};

//update Salesman
exports.updateSalesman = async function (db, salesman) {
    if (db === undefined || salesman === undefined) {
        console.log("Expected Element");
    } else {
        let test = await db.collection("salesman").find({id: parseInt(salesman.id)}).toArray();
        if (test.length !== 0) {
            let new_values = {$set: {firstname: salesman.firstname, lastname: salesman.lastname}};
            await db.collection("salesman").updateOne({id: parseInt(salesman.id)}, new_values);
        } else {
            console.log("Element not found");
        }
    }

};

//delete Salesman
exports.deleteSalesman = async function (db, id) {
    if (db === undefined || id === undefined) {
        console.log("Expected Element");
    } else {
        let test = await db.collection("salesman").find({id: parseInt(id)}).toArray();
        if (test.length !== 0) {
            await db.collection("salesman").deleteOne({id: parseInt(id)});
        } else {
            console.log("Element not found");
        }
    }
};

//create EvaluationRecord
exports.createEvaluationRecord = async function (db, id, evaluationRecord) {
    if (db === undefined || id === undefined || evaluationRecord === undefined) {
        console.log("Expected Element");
    } else {
        let test = await db.collection("records").find({id: parseInt(id), "EvaluationRecord.year": parseInt(evaluationRecord.year)}).toArray();
        if (test.length === 0) {
            await db.collection("records").insertOne({id: parseInt(id),EvaluationRecord: evaluationRecord});
        } else {
            console.log("Element already exists");
        }
    }
};

//read EvaluationRecord
exports.readEvaluationRecord = async function (db, id, year) {
    if (db === undefined) {
        console.log("Expected Element");
    } else {
        if (year === undefined && id === undefined) {
            let test = await db.collection("records").find({}).toArray();
            if (test.length === 0) {
                console.log("Element(s) not found");
            } else {
                //return all records
                return test;
            }
        } else if (id !== undefined && year !== undefined ) {
            let test1 = await db.collection("records").find({id: parseInt(id), "EvaluationRecord.year": parseInt(year)}).toArray();
            if (test1.length === 0) {
                console.log("Element(s) not found");
            } else {
                //return the record of the given salesman in the given year
                return test1[0];
            }
        } else if (year === undefined) {
            let test = await db.collection("records").find({id: parseInt(id)}).toArray();
            if (test.length === 0) {
                console.log("Element(s) not found");
            } else {
                //return all records of this salesman
                return test;
            }
        } else {
            console.log("To much params");
        }
    }
};

//delete EvaluationRecord
exports.deleteEvaluationRecord = async function (db, id, year) {
    if (db === undefined || id === undefined || year === undefined) {
        console.log("Expected Element");
    } else {
        let test = await db.collection("records").find({id: parseInt(id), "EvaluationRecord.year": parseInt(year)}).toArray();
        if (test.length !== 0) {
            await db.collection("records").deleteOne({id: parseInt(id), "EvaluationRecord.year": parseInt(year)});
        } else {
            console.log("Element not found");
        }
    }

};

//create EvaluationRecordentry
exports.createEvaluationRecordEntry = async function (db, id, year, evaluationrecordentry) {
    if (db === undefined || id === undefined || year === undefined || evaluationrecordentry === undefined){
        console.log("Expected Element");
    } else {
        //get the record-entries
        let evaluationRecord1 = await this.readEvaluationRecord(db,id,year);
        let list = evaluationRecord1.EvaluationRecord.entries;

        //check if name already exists
        let name_exists = false;
        if (list === undefined){
            list = [];
        } else {
            for(let i = 0; i < list.length; i++){
                if(evaluationrecordentry.name === list[i].name){
                    name_exists = true;
                }
            }
        }

        if (name_exists){
            console.log("Element already exists");
        } else {
            //add the entry and update the record
            list.push(evaluationrecordentry);
            let newvalues = {$set: {"EvaluationRecord.year": parseInt(year), "EvaluationRecord.entries": list}};
            await db.collection("records").updateOne({id: parseInt(id), "EvaluationRecord.year": parseInt(year)}, newvalues);
        }
    }
};

//read EvaluationRecordentry
exports.readEvaluationRecordEntry = async function (db, id, year, name) {
    if (db === undefined || id === undefined || year === undefined){
        console.log("Expected Element");
    } else {
        if (name === undefined) {
            //get all entries of one id-year combination
            let evaluationRecord1 = await this.readEvaluationRecord(db,id,year);
            return evaluationRecord1.EvaluationRecord.entries;
        } else {
            //get one entry of one id-year combination
            let evaluationRecord1 = await this.readEvaluationRecord(db,id,year);
            let list = evaluationRecord1.EvaluationRecord.entries;
            for(let i = 0; i < list.length; i++){
                if(name === list[i].name){
                   return list[i];
                }
            }
        }
    }
};

//update EvaluationRecordentry
exports.updateEvaluationRecordEntry = async function (db, id, year, evaluationrecordentry) {
    if (db === undefined || id === undefined || year === undefined || evaluationrecordentry === undefined){
        console.log("Expected Element");
    } else {
        //get the record-entries
        let evaluationRecord1 = await this.readEvaluationRecord(db,id,year);
        let list = evaluationRecord1.EvaluationRecord.entries;

        let worked = false;
        for (let i = 0; i < list.length; i++) {
            if (list[i].name === evaluationrecordentry.name) {
                list[i] = evaluationrecordentry;
                worked = true;
            }
        }
        if (worked){
            //update records with new entries
            var newvalues = {$set: {"EvaluationRecord.year": parseInt(year),"EvaluationRecord.entries": list}};
            await db.collection("records").updateOne({id: parseInt(id),"EvaluationRecord.year": parseInt(year)}, newvalues);
        } else {
            console.log("Element(s) not found");
        }
    }
};

//delete EvaluationRecordentry
exports.deleteEvaluationRecordEntry = async function (db, id, year, name) {
        if (db === undefined || id === undefined || year === undefined) {
            console.log("Expected Element");
        } else {
            //get the record-entries
            let evaluationRecord1 = await this.readEvaluationRecord(db, id, year);
            let list = evaluationRecord1.EvaluationRecord.entries;

            let worked = false;
            //filter out the entry to delete it
            let newentries = [];
            for (let i = 0; i < list.length; i++) {
                if (list[i].name !== name) {
                    newentries.push(list[i]);
                } else {
                    worked = true;
                }
            }

            if (worked){
                //update records with new entries
                let newvalues = {$set: {"EvaluationRecord.year": parseInt(year), "EvaluationRecord.entries": newentries}};
                await db.collection("records").updateOne({id: parseInt(id), "EvaluationRecord.year": parseInt(year)}, newvalues);
            } else {
                console.log("Element(s) not found");
            }
        }
    };
