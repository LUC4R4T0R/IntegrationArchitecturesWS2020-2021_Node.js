var EvaluationRecordEntry = require('../models/EvaluationRecordEntry');
var managepersonal = require('../services/managepersonal');

exports.list = function(req, res){
    var db = req.app.get('db');
    (async () => {
        var result = await managepersonal.readEvaluationRecordentry(db, req.params.id, req.params.year);
        res.send(result);
    })();
}

exports.create = function(req, res){
    var db = req.app.get('db');
    let evaluationRecordEntry = req.body;
    managepersonal.createEvaluationRecordentry(db, req.params.id, req.params.year, evaluationRecordEntry).then(() => {
        res.send('success');
    });
}

exports.update = function(req, res){
    var db = req.app.get('db');
    let evaluationRecordEntry = req.body;
    managepersonal.updateEvaluationRecordentry(db, evaluationRecordEntry, req.params.id, req.params.year);
    res.send('success');
}

exports.find = function(req, res){
    var db = req.app.get('db');
    (async () => {
        var result = await managepersonal.readEvaluationRecordentry(db, req.params.id, req.params.year, req.params.name);
        res.send(result);
    })();
}

exports.remove = function(req, res){
    var db = req.app.get('db');
    managepersonal.deleteEvaluationRecordentry(db, req.params.id, req.params.year).then(() => {
        res.send('success');
    });
}