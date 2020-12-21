let evaluationrecord_service = require('./EvaluationRecord');
let NoElementFoundError = require('../custom_errors/NoElementFoundError');
let ElementDuplicateError = require('../custom_errors/ElementDuplicateError');
let BadInputError = require('../custom_errors/BadInputError');
let MissingElementError = require('../custom_errors/MissingElementError');

//create EvaluationRecordentry
exports.createEvaluationRecordEntry = async function (db, id, year, evaluationrecordentry) {
    if (db === undefined || id === undefined || year === undefined || evaluationrecordentry === undefined){
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    }
    if (!id.match(/^[\d]+$/g)||!year.match(/^[\d]+$/g)||!evaluationrecordentry.name.match(/^[\w]+$/g)){
        throw new BadInputError("BadInputError: The id and year must be numbers (example input: 1234) and the name must be at least a character (example input 'a')!");
    } else {
        //get the record-entries
        let evaluationRecord1 = await evaluationrecord_service.readEvaluationRecord(db,id,year);
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
            throw new ElementDuplicateError("ElementDuplicateError: You tried to create an EvaluationRecordEntry that already exists!");
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
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    } else {
        if (name === undefined) {
            if (!id.match(/^[\d]+$/g)){
                throw new BadInputError("BadInputError: The id and year must be numbers (example input: 1234)!");
            }
            //get all entries of one id-year combination
            let evaluationRecord1 = await evaluationrecord_service.readEvaluationRecord(db,id,year);
            return evaluationRecord1.EvaluationRecord.entries;
        } else {
            if (!id.match(/^[\d]+$/g)||!year.match(/^[\d]+$/g)||!name.match(/^[\w]+$/g)){
                throw new BadInputError("BadInputError: The id and year must be numbers (example input: 1234) and the name must be at least a character (example input 'a')!");
            }
            //get one entry of one id-year combination
            let evaluationRecord1 = await evaluationrecord_service.readEvaluationRecord(db,id,year);
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
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    }
    if (!id.match(/^[\d]+$/g)||!year.match(/^[\d]+$/g)||!evaluationrecordentry.name.match(/^[\w]+$/g)){
        throw new BadInputError("BadInputError: The id and year must be numbers (example input: 1234) and the name must be at least a character (example input 'a')!");
    } else {
        //get the record-entries
        let evaluationRecord1 = await evaluationrecord_service.readEvaluationRecord(db,id,year);
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
            let newvalues = {$set: {"EvaluationRecord.year": parseInt(year),"EvaluationRecord.entries": list}};
            await db.collection("records").updateOne({id: parseInt(id),"EvaluationRecord.year": parseInt(year)}, newvalues);
        } else {
            throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecordEntry (EvaluationRecord id: "+id+" ,year: "+year+") with the name: "+evaluationrecordentry.name+"!");
        }
    }
};

//delete EvaluationRecordentry
exports.deleteEvaluationRecordEntry = async function (db, id, year, name) {
    if (db === undefined || id === undefined || year === undefined) {
        throw new MissingElementError("MissingElementError: At least one of the required parameters is undefined!");
    }
    if (!id.match(/^[\d]+$/g)||!year.match(/^[\d]+$/g)||!name.match(/^[\w]+$/g)){
        throw new BadInputError("BadInputError: The id and year must be numbers (example input: 1234) and the name must be at least a character (example input 'a')!");
    } else {
        //get the record-entries
        let evaluationRecord1 = await evaluationrecord_service.readEvaluationRecord(db, id, year);
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
            throw new NoElementFoundError("NoElementFoundError: In the given Database exists no EvaluationRecordEntry (EvaluationRecord id: "+id+" ,year: "+year+") with the name: "+name+"!");
        }
    }
};
