let EvaluationRecordEntry = require('../models/EvaluationRecordEntry');
let evaluationRecordEntry_service = require('../services/EvaluationRecordEntry');

exports.create = function(req, res){
    let db = req.app.get('db');
    let evaluationRecordEntry = req.body;
    evaluationRecordEntry_service.createEvaluationRecordEntry(db, req.params.id, req.params.year, evaluationRecordEntry)
        .then(() => res.send('success'))
        .catch(() => res.status(400).send("fail"));
}

exports.list = function(req, res){
    let db = req.app.get('db');
    evaluationRecordEntry_service.readEvaluationRecordEntry(db, req.params.id, req.params.year)
        .then(result => res.send(result))
        .catch(() => res.status(400).send("fail"));
}

exports.find = function(req, res){
    let db = req.app.get('db');
        evaluationRecordEntry_service.readEvaluationRecordEntry(db, req.params.id, req.params.year, req.params.name)
            .then(result => res.send(result))
            .catch(() => res.status(400).send("fail"));
}

exports.update = function(req, res){
    let db = req.app.get('db');
    let evaluationRecordEntry = req.body;
    evaluationRecordEntry_service.updateEvaluationRecordEntry(db, req.params.id, req.params.year, evaluationRecordEntry)
        .then(() => res.send('success'))
        .catch(() => res.status(400).send("fail"));
}

exports.remove = function(req, res){
    let db = req.app.get('db');
    evaluationRecordEntry_service.deleteEvaluationRecordEntry(db, req.params.id, req.params.year,req.params.name)
        .then(() => res.send('success'))
        .catch(() => res.status(400).send("fail"));
}