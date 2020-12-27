let EvaluationRecord = require('../models/EvaluationRecord');
let evaluationRecord_service = require('../services/EvaluationRecord');
let auth_service = require('../services/Authentication');

exports.create = function(req, res){
    try{
        auth_service.authenticated(req.session);
        let db = req.app.get('db');
        let evaluationRecord = req.body;
        evaluationRecord_service.createEvaluationRecord(db, req.params.id, evaluationRecord)
            .then(() => res.send('success'))
            .catch((error) => res.status(error.statusCode).send(error.message));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}

exports.list = function(req, res){
    try{
        auth_service.authenticated(req.session);
        let db = req.app.get('db');
        evaluationRecord_service.readEvaluationRecord(db, req.params.id)
            .then(result => res.send(result))
            .catch((error) => res.status(error.statusCode).send(error.message));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}

exports.find = function(req, res){
    try{
        auth_service.authenticated(req.session);
        let db = req.app.get('db');
        evaluationRecord_service.readEvaluationRecord(db, req.params.id, req.params.year)
            .then(result => res.send(result))
            .catch((error) => res.status(error.statusCode).send(error.message));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}

//exports.update = function(req, res){}

exports.remove = function(req, res){
    try{
        auth_service.authenticated(req.session);
        let db = req.app.get('db');
        evaluationRecord_service.deleteEvaluationRecord(db, req.params.id, req.params.year)
            .then(() => res.send('success'))
            .catch((error) => res.status(error.statusCode).send(error.message));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}