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