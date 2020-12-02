//create Salesman
exports.createSalesman = async function (db, salesman) {
    await db.collection("salesman").insertOne(salesman, function (err, res) {
        if (err) throw err;
        console.log("1 Salesman inserted");
    });
}

//read Salesman
exports.readSalesman = async function (db, salesmanId, query) {
    if (salesmanId === undefined && query === undefined) {
        return db.collection("salesman").find({}).toArray();
    } else if (salesmanId === undefined) {
        return db.collection("salesman").find(query).toArray();
    } else if (query === undefined) {
        return db.collection("salesman").findOne({id: parseInt(salesmanId)});
    } else {
        //throw exception
    }
}

//update Salesman
exports.updateSalesman = async function (db, salesman) {
    var newvalues = {$set: {firstname: salesman.firstname, lastname: salesman.lastname}};
    await db.collection("salesman").updateOne({id: parseInt(salesman.id)}, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 Salesman updated");
    });
}

//delete Salesman
exports.deleteSalesman = async function (db, id) {
    await db.collection("salesman").deleteOne({id: parseInt(id)}, function (err, obj) {
        if (err) throw err;
        console.log("1 Salesman deleted");
    });
}

//create EvaluationRecord
exports.createEvaluationRecord = async function (db, id, evaluationrecord) {
    await db.collection("records").insertOne({id: parseInt(id), evaluationrecord: evaluationrecord}, function (err, res) {
        if (err) throw err;
        console.log("1 Evaluationrecord inserted");
    });
}

//read EvaluationRecord
exports.readEvaluationRecord = async function (db, id, year) {
    if (year === undefined && id === undefined) {
        return db.collection("records").find({}).toArray();
    } else if (year !== undefined && id !== undefined) {
        return db.collection("records").findOne({id: parseInt(id), evaluationrecord:{year: parseInt(year)}});
    } else if (year === undefined) {
        return db.collection("records").find({id: parseInt(id)}).toArray();
    }
}

//delete EvaluationRecord
exports.deleteEvaluationRecord = async function (db, year, id) {
    await db.collection("salesman").deleteOne({id: id, evaluationrecord:{year: parseInt(year)}}, function (err, obj) {
        if (err) throw err;
        console.log("1 Evaluationrecord deleted");
    });
}


//create EvaluationRecordentry
exports.createEvaluationRecordentry = async function (db, id, year, evaluationrecordentry) {
    //get the record
    var evaluationrecord;
    await db.collection("records").findOne({id: id, evaluationrecord:{year: parseInt(year)}}, function (err, result) {
        if (err) throw err;
        console.log(result);
        evaluationrecord = result;
    });

    //add the entry and update the record
    var list = evaluationrecord.entries;
    list.push(evaluationrecordentry);
    var newvalues = {$set: {evaluationrecord:{entries:list}}};
    await db.collection("records").updateOne({id: id, evaluationrecord:{year: parseInt(year)}}, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 entry created");
    });
}

//read EvaluationRecordentry
exports.readEvaluationRecordentry = async function (db, year, id, name) {
    if (name === undefined){
        //get the record entries
        await db.collection("records").findOne({id: id, evaluationrecord:{year: parseInt(year)}}, function (err, result) {
            if (err) throw err;
            console.log(result);
            return result.entries;
        });
    } else if(name !== undefined){
        //get the record
        var evaluationrecord;
        await db.collection("records").findOne({id: id, evaluationrecord:{year: parseInt(year)}}, function (err, result) {
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
exports.updateEvaluationRecordentry = async function (db, evaluationrecordentry, id, year) {
    //get the record
    var evaluationrecord;
    await db.collection("records").findOne({id: id, evaluationrecord:{year: parseInt(year)}}, function (err, result) {
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
    var newvalues = {$set: {evaluationrecord:{entries:entries}}};
    await db.collection("records").updateOne({id: id, evaluationrecord:{year: parseInt(year)}}, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 entry updated");
    });
}

//delete EvaluationRecordentry
exports.deleteEvaluationRecordentry = async function (db, year, id) {
    //get the record
    var evaluationrecord;
    await db.collection("records").findOne({id: id, evaluationrecord:{year: parseInt(year)}}, function (err, result) {
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
    var newvalues = {$set: {evaluationrecord:{entries:newentries}}};
    await db.collection("records").updateOne({id: id, evaluationrecord:{year: parseInt(year)}}, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 entry deleted");
    });
}