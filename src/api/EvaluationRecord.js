const evaluationRecord_service = require('../services/EvaluationRecord');
const auth_service = require('../services/Authentication');
const EvaluationRecord = require('../models/EvaluationRecord');
const BadInputError = require("../custom_errors/BadInputError");

exports.create = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecord_service.createEvaluationRecord(db, req.params.id, inputFilter(req.body));
        })
        .then(() => res.send('success'))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.list = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecord_service.readAllEvaluationRecord(db, req.params.id);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.find = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecord_service.readOneEvaluationRecord(db, req.params.id, req.params.year);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.addBonus = function (req, res){

}

exports.remove = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecord_service.deleteEvaluationRecord(db, req.params.id, req.params.year);
        })
        .then(() => res.send('success'))
        .catch((error) => res.status(error.statusCode).send(error.message));

}

function inputFilter(record) {
    try{
        return new EvaluationRecord(record.year);
    }catch(e){
        throw new BadInputError('The given record does not match the model of an record!');
    }
}
