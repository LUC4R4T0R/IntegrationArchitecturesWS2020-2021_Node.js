var EvaluationRecord = require('../models/EvaluationRecord');
var managepersonal = require('../services/managepersonal');

exports.list = function(req, res){
    var db = req.app.get('db');
    (async () => {
        var result = await managepersonal.readEvaluationRecord(db, req.params.id);
        res.send(result);
    })();
}

exports.create = function(req, res){
    var db = req.app.get('db');
    let evaluationRecord = req.body;
    managepersonal.createEvaluationRecord(db, req.params.id, evaluationRecord).then(() => {
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
        var result = await managepersonal.readEvaluationRecord(db, req.params.id, req.params.year);
        res.send(result);
    })();
}

exports.remove = function(req, res){
    var db = req.app.get('db');
    managepersonal.deleteEvaluationRecord(db, req.params.id, req.params.year).then(() => {
        res.send('success');
    });
}