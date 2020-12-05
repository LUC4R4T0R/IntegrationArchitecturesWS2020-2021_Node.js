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
}

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
}

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

}

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
}

//create EvaluationRecord
exports.createEvaluationRecord = async function (db, id, evaluationRecord) {
    if (db === undefined || id === undefined || evaluationRecord === undefined) {
        console.log("Expected Element");
    } else {
        let test = await db.collection("records").find({id: parseInt(id), evaluationRecord: {year: parseInt(evaluationRecord.year)}}).toArray();
        if (test.length === 0) {
            await db.collection("records").insertOne({id: parseInt(id),evaluationRecord: evaluationRecord});
        } else {
            console.log("Element already exists");
        }
    }
}

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
        } else if (year !== undefined && id !== undefined) {
            let test = await db.collection("records").find({id: parseInt(id), evaluationRecord: {year: parseInt(year)}}).toArray();
            if (test.length === 0) {
                console.log("Element(s) not found");
            } else {
                //return the record of the given salesman in the given year
                return test[0];
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
}

//delete EvaluationRecord
exports.deleteEvaluationRecord = async function (db, id, year) {
    if (db === undefined || id === undefined || year === undefined) {
        console.log("Expected Element");
    } else {
        let test = await db.collection("records").find({id: parseInt(id), evaluationRecord: {year: parseInt(year)}}).toArray();
        if (test.length !== 0) {
            await db.collection("records").deleteOne({id: parseInt(id), evaluationRecord: {year: parseInt(year)}});
        } else {
            console.log("Element not found");
        }
    }

}


//create EvaluationRecordentry
exports.createEvaluationRecordentry = async function (db, id, year, evaluationrecordentry) {
    //get the record
    let evaluationRecord = await db.collection("records").find({id: parseInt(id), evaluationRecord: {year: parseInt(year)}}).toArray();

    //add the entry and update the record
    let list = evaluationRecord[0].entries;
    list.push(evaluationrecordentry);
    let newvalues = {$set: {evaluationRecord: {entries: list}}};
    await db.collection("records").updateOne({
        id: parseInt(id),
        evaluationRecord: {year: parseInt(year)}
    }, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 entry created");
    });
}

//read EvaluationRecordentry
exports.readEvaluationRecordentry = async function (db, id, year, name) {
    if (name === undefined) {
        //get the record entries
        await db.collection("records").findOne({
            id: parseInt(id),
            evaluationrecord: {year: parseInt(year)}
        }, function (err, result) {
            if (err) throw err;
            console.log(result);
            return result.entries;
        });
    } else if (name !== undefined) {
        //get the record
        var evaluationrecord;
        await db.collection("records").findOne({
            id: parseInt(id),
            evaluationrecord: {year: parseInt(year)}
        }, function (err, result) {
            if (err) throw err;
            console.log(result);
            evaluationrecord = result;
        });
        //get the specific entry
        var entries = evaluationrecord.entries;
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].name == name) {
                return entries[i];
            }
        }
    }
}

//update EvaluationRecordentry
exports.updateEvaluationRecordentry = async function (db, id, year, evaluationrecordentry) {
    //get the record
    var evaluationrecord;
    await db.collection("records").findOne({
        id: parseInt(id),
        evaluationrecord: {year: parseInt(year)}
    }, function (err, result) {
        if (err) throw err;
        console.log(result);
        evaluationrecord = result;
    });

    //get the entries and change the right one
    var entries = evaluationrecord.entries;
    for (let i = 0; i < entries.length; i++) {
        if (entries[i].name == evaluationrecordentry.name) {
            entries[i] = evaluationrecordentry;
        }
    }

    //update records with new entries
    var newvalues = {$set: {evaluationrecord: {entries: entries}}};
    await db.collection("records").updateOne({
        id: parseInt(id),
        evaluationrecord: {year: parseInt(year)}
    }, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 entry updated");
    });
}

//delete EvaluationRecordentry
exports.deleteEvaluationRecordentry = async function (db, id, year) {
    //get the record
    var evaluationrecord;
    await db.collection("records").findOne({
        id: parseInt(id),
        evaluationrecord: {year: parseInt(year)}
    }, function (err, result) {
        if (err) throw err;
        console.log(result);
        evaluationrecord = result;
    });

    //get all entries except the one to delete
    var entries = evaluationrecord.entries;
    var newentries = [];
    for (let i = 0; i < entries.length; i++) {
        if (entries[i].name != name) {
            newentries.push(entries[i]);
        }
    }

    //update records with new entries
    var newvalues = {$set: {evaluationrecord: {entries: newentries}}};
    await db.collection("records").updateOne({
        id: parseInt(id),
        evaluationrecord: {year: parseInt(year)}
    }, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 entry deleted");
    });
}