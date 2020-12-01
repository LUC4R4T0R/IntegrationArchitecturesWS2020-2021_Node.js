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
        return db.collection("records").find({}).toArray(function (err, result) {
        });
    } else if (year !== undefined && id !== undefined) {
        return db.collection("records").findOne({id: parseInt(id), evaluationrecord:{year: parseInt(year)}}, function (err, result) {
        });
    } else if (year !== undefined) {
        return db.collection("records").findOne({id: parseInt(id)}, function (err, result) {
        });
    }
}

//delete EvaluationRecord
exports.deleteEvaluationRecord = async function (db, year, id) {
    await db.collection("salesman").deleteOne({id: id, year: evaluationrecord.year}, function (err, obj) {
        if (err) throw err;
        console.log("1 Evaluationrecord deleted");
    });
}


//create EvaluationRecordentry
exports.createEvaluationRecordentry = async function (db, id, year, evaluationrecordentry) {
    var evaluationrecord;
    await db.collection("records").findOne({id: id, year: evaluationrecord.year}, function (err, result) {
        if (err) throw err;
        console.log(result);
        evaluationrecord = result;
    });

    evaluationrecord.entries[evaluationrecord.entries.length] = evaluationrecordentry;
}

//read EvaluationRecordentry
exports.readEvaluationRecordentry = async function (db, year, id, name) {

}

//update EvaluationRecordentry
exports.updateEvaluationRecordentry = async function (db, evaluationrecordentry, id, year) {
    var evaluationrecord;
    await db.collection("records").findOne({id: id, year: evaluationrecord.year}, function (err, result) {
        if (err) throw err;
        console.log(result);
        evaluationrecord = result;
    });

    var entries = evaluationrecord.entries;
    for (let i = 0; i < entries.length; i++) {
        if (entries[i].name == name) {
            entries[i] = evaluationrecordentry;
        }
    }


}

//delete EvaluationRecordentry
exports.deleteEvaluationRecordentry = async function (db, year, id) {

}