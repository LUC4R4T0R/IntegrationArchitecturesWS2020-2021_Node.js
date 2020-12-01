//create Salesman
function createSalesman(db, salesman){
    db.collection("salesman").insertOne(salesman, function(err, res) {
        if (err) throw err;
        console.log("1 Salesman inserted");
    });
}

//read Salesman
function readSalesmanById(db, salesmanId, query){
    if(salesmanId === undefined && query === undefined){
        db.collection("salesman").findOne({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
        });
    } else if(salesmanId === undefined){
        db.collection("salesman").findOne(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
        });
    }else if(query === undefined){
        db.collection("salesman").findOne({id:salesmanId}, function(err, result) {
            if (err) throw err;
            console.log(result.firstname + " " + result.lastname);
        });
    }else{
        //throw exception
    }
}

//update Salesman
function updateSalesman(db, salesman){
    var newvalues = { $set: {firstname: salesman.firstname, address: salesman.lastname} };
    db.collection("salesman").updateOne({id: salesman.id}, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 Salesman updated");
    });
}

//delete Salesman
function deleteSalesman(db, id){
    db.collection("salesman").deleteOne({id: id}, function(err, obj){
        if (err) throw err;
        console.log("1 Salesman updated");
    });
}

