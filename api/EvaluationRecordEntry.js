var EvaluationRecordEntry = require('../models/EvaluationRecordEntry');
var managepersonal = require('../services/managepersonal');

exports.list = function(req, res){
    var db = req.app.get('db');
    (async () => {
        var result = await managepersonal.readEvaluationRecordEntry(db, req.params.id, req.params.year);
        res.send(result);
    })();
}

exports.create = function(req, res){
    var db = req.app.get('db');
    let evaluationRecordEntry = req.body;
    managepersonal.createEvaluationRecordEntry(db, req.params.id, req.params.year, evaluationRecordEntry).then(() => {
        res.send('success');
    });
}

exports.update = function(req, res){
    var db = req.app.get('db');
    let evaluationRecordEntry = req.body;
    managepersonal.updateEvaluationRecordEntry(db, req.params.id, req.params.year, evaluationRecordEntry);
    res.send('success');
}

exports.find = function(req, res){
    var db = req.app.get('db');
    (async () => {
        var result = await managepersonal.readEvaluationRecordEntry(db, req.params.id, req.params.year, req.params.name);
        res.send(result);
    })();
}

exports.remove = function(req, res){
    var db = req.app.get('db');
    managepersonal.deleteEvaluationRecordEntry(db, req.params.id, req.params.year,req.params.name).then(() => {
        res.send('success');
    });
}