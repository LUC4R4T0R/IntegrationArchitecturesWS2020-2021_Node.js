//create Salesman
exports.createSalesman = function (db, salesman) {
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
        var test = await db.collection("salesman").findOne({id: salesmanId});
        console.log(test);
        return test;
    } else {
        //throw exception
    }
}

//update Salesman
exports.updateSalesman = function (db, salesman) {
    var newvalues = {$set: {firstname: salesman.firstname, address: salesman.lastname}};
    db.collection("salesman").updateOne({id: salesman.id}, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 Salesman updated");
    });
}

//delete Salesman
exports.deleteSalesman = function (db, id) {
    db.collection("salesman").deleteOne({id: id}, function (err, obj) {
        if (err) throw err;
        console.log("1 Salesman deleted");
    });
}

//create Evaluationrecord
exports.createEvaluationrecord = function (db, id, evaluationrecord) {
    db.collection("records").insertOne({id: id, evaluationrecord: evaluationrecord}, function (err, res) {
        if (err) throw err;
        console.log("1 Evaluationrecord inserted");
    });
}

//read Evaluationrecord
exports.readEvaluationrecord = function (db, year, id) {
    if (year === undefined && id === undefined) {
        db.collection("records").findOne({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    } else if (year !== undefined && id !== undefined) {
        db.collection("records").findOne({id: id, year: evaluationrecord.year}, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    } else {
        //throw exception
    }
}

//delete Evaluationrecord
exports.deleteEvaluationrecord = function (db, year, id) {
    db.collection("salesman").deleteOne({id: id, year: evaluationrecord.year}, function (err, obj) {
        if (err) throw err;
        console.log("1 Evaluationrecord deleted");
    });
}


//create Evaluationrecordentry
exports.createEvaluationrecordentry = function (db, id, year,evaluationrecordentry) {

}

//read Evaluationrecordentry
exports.readEvaluationrecordentry = function (db, year, id) {

}

//update Evaluationrecordentry
exports.updateEvaluationrecordentry = function (db, salesman) {

}

//delete Evaluationrecordentry
exports.deleteEvaluationrecordentry = function (db, year, id) {

}