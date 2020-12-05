var EvaluationRecordEntry = require('../models/EvaluationRecordEntry');
var evaluationRecordEntry_service = require('../services/EvaluationRecordEntry');

exports.list = function(req, res){
    var db = req.app.get('db');
    (async () => {
        var result = await evaluationRecordEntry_service.readEvaluationRecordEntry(db, req.params.id, req.params.year);
        res.send(result);
    })();
}

exports.create = function(req, res){
    var db = req.app.get('db');
    let evaluationRecordEntry = req.body;
    evaluationRecordEntry_service.createEvaluationRecordEntry(db, req.params.id, req.params.year, evaluationRecordEntry).then(() => {
        res.send('success');
    });
}

exports.update = function(req, res){
    var db = req.app.get('db');
    let evaluationRecordEntry = req.body;
    evaluationRecordEntry_service.updateEvaluationRecordEntry(db, req.params.id, req.params.year, evaluationRecordEntry);
    res.send('success');
}

exports.find = function(req, res){
    var db = req.app.get('db');
    (async () => {
        var result = await evaluationRecordEntry_service.readEvaluationRecordEntry(db, req.params.id, req.params.year, req.params.name);
        res.send(result);
    })();
}

exports.remove = function(req, res){
    var db = req.app.get('db');
    evaluationRecordEntry_service.deleteEvaluationRecordEntry(db, req.params.id, req.params.year,req.params.name).then(() => {
        res.send('success');
    });
}