var EvaluationRecord = require('../models/EvaluationRecord');
var evaluationRecord_service = require('../services/EvaluationRecord');

exports.list = function(req, res){
    var db = req.app.get('db');
    (async () => {
        var result = await evaluationRecord_service.readEvaluationRecord(db, req.params.id);
        res.send(result);
    })();
}

exports.create = function(req, res){
    var db = req.app.get('db');
    let evaluationRecord = req.body;
    evaluationRecord_service.createEvaluationRecord(db, req.params.id, evaluationRecord).then(() => {
        res.send('success');
    });
}

/*
exports.update = function(req, res){

}
*/

exports.find = function(req, res){
    var db = req.app.get('db');
    (async () => {
        var result = await evaluationRecord_service.readEvaluationRecord(db, req.params.id, req.params.year);
        res.send(result);
    })();
}

exports.remove = function(req, res){
    var db = req.app.get('db');
    evaluationRecord_service.deleteEvaluationRecord(db, req.params.id, req.params.year).then(() => {
        res.send('success');
    });
}