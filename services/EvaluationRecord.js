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