let EvaluationRecord = require('../models/EvaluationRecord');
let evaluationRecord_service = require('../services/EvaluationRecord');

exports.create = function(req, res){
    let db = req.app.get('db');
    let evaluationRecord = req.body;
    evaluationRecord_service.createEvaluationRecord(db, req.params.id, evaluationRecord)
        .then(() => res.send('success'))
        .catch(() => res.status(400).send("fail"));
}

exports.list = function(req, res){
    let db = req.app.get('db');
        evaluationRecord_service.readEvaluationRecord(db, req.params.id)
            .then(result => res.send(result))
            .catch(() => res.status(400).send("fail"));

}

exports.find = function(req, res){
    let db = req.app.get('db');
        evaluationRecord_service.readEvaluationRecord(db, req.params.id, req.params.year)
            .then(result => res.send(result))
            .catch(() => res.status(400).send("fail"));
}

//exports.update = function(req, res){}

exports.remove = function(req, res){
    let db = req.app.get('db');
    evaluationRecord_service.deleteEvaluationRecord(db, req.params.id, req.params.year)
        .then(() => res.send('success'))
        .catch(() => res.status(400).send("fail"));
}