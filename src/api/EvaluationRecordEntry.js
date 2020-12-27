let EvaluationRecordEntry = require('../models/EvaluationRecordEntry');
let evaluationRecordEntry_service = require('../services/EvaluationRecordEntry');
let auth_service = require('../services/Authentication');

exports.create = function(req, res){
    try{
        auth_service.authenticated(req.session);
        let db = req.app.get('db');
        let evaluationRecordEntry = req.body;
        evaluationRecordEntry_service.createEvaluationRecordEntry(db, req.params.id, req.params.year, evaluationRecordEntry)
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
        evaluationRecordEntry_service.readEvaluationRecordEntry(db, req.params.id, req.params.year)
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
        evaluationRecordEntry_service.readEvaluationRecordEntry(db, req.params.id, req.params.year, req.params.name)
            .then(result => res.send(result))
            .catch((error) => res.status(error.statusCode).send(error.message));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}

exports.update = function(req, res){
    try{
        auth_service.authenticated(req.session);
        let db = req.app.get('db');
        let evaluationRecordEntry = req.body;
        evaluationRecordEntry_service.updateEvaluationRecordEntry(db, req.params.id, req.params.year, evaluationRecordEntry)
            .then(() => res.send('success'))
            .catch((error) => res.status(error.statusCode).send(error.message));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}

exports.remove = function(req, res){
    try{
        auth_service.authenticated(req.session);
        let db = req.app.get('db');
        evaluationRecordEntry_service.deleteEvaluationRecordEntry(db, req.params.id, req.params.year,req.params.name)
            .then(() => res.send('success'))
            .catch((error) => res.status(error.statusCode).send(error.message));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}