//create Salesman
exports.createSalesman = async function (db, salesman) {
    db.collection("salesman").insertOne(salesman, function (err, res) {
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
        test = db.collection("salesman").findOne({id: parseInt(salesmanId)});
        return test[0];
    } else {
        //throw exception
    }
}

//update Salesman
exports.updateSalesman = async function (db, salesman) {
    var newvalues = {$set: {firstname: salesman.firstname, lastname: salesman.lastname}};
    db.collection("salesman").updateOne({id: parseInt(salesman.id)}, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 Salesman updated");
    });
}

//delete Salesman
exports.deleteSalesman = async function (db, id) {
    db.collection("salesman").deleteOne({id: parseInt(id)}, function (err, obj) {
        if (err) throw err;
        console.log("1 Salesman deleted");
    });
}

//create Evaluationrecord
exports.createEvaluationrecord = async function (db, id, evaluationrecord) {
    db.collection("records").insertOne({id: id, evaluationrecord: evaluationrecord}, function (err, res) {
        if (err) throw err;
        console.log("1 Evaluationrecord inserted");
    });
}

//read Evaluationrecord
exports.readEvaluationrecord = async function (db, year, id) {
    if (year === undefined && id === undefined) {
        return db.collection("records").findOne({}).toArray(function (err, result) {
        });
    } else if (year !== undefined && id !== undefined) {
        return db.collection("records").findOne({id: id, year: evaluationrecord.year}, function (err, result) {
        });
    } else {
        //throw exception
    }
}

//delete Evaluationrecord
exports.deleteEvaluationrecord = async function (db, year, id) {
    db.collection("salesman").deleteOne({id: id, year: evaluationrecord.year}, function (err, obj) {
        if (err) throw err;
        console.log("1 Evaluationrecord deleted");
    });
}


//create Evaluationrecordentry
exports.createEvaluationrecordentry = async function (db, id, year, evaluationrecordentry) {
    var evaluationrecord;
    db.collection("records").findOne({id: id, year: evaluationrecord.year}, function (err, result) {
        if (err) throw err;
        console.log(result);
        evaluationrecord = result;
    });

    evaluationrecord.entries[evaluationrecord.entries.length] = evaluationrecordentry;
}

//read Evaluationrecordentry
exports.readEvaluationrecordentry = async function (db, year, id, name) {

}

//update Evaluationrecordentry
exports.updateEvaluationrecordentry = async function (db, evaluationrecordentry, id, year) {
    var evaluationrecord;
    db.collection("records").findOne({id: id, year: evaluationrecord.year}, function (err, result) {
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

//delete Evaluationrecordentry
exports.deleteEvaluationrecordentry = async function (db, year, id) {

}