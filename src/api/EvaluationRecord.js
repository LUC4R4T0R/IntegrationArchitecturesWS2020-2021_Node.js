const evaluationRecord_service = require('../services/EvaluationRecordService');
const auth_service = require('../services/AuthenticationService');
const EvaluationRecord = require('../models/EvaluationRecord');
const BadInputError = require("../custom_errors/BadInputError");

exports.create = function (req, res) {
    auth_service.authenticated(req.session, 2)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecord_service.createEvaluationRecord(db, req.params.id, inputFilter(req.body));
        })
        .then(() => res.send('success'))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.list = function (req, res) {
    auth_service.authenticated(req.session, 1)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecord_service.readAllEvaluationRecords(db, req.params.id);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.find = function (req, res) {
    auth_service.authenticated(req.session, 1)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecord_service.readOneEvaluationRecord(db, req.params.id, req.params.year);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.remove = function (req, res) {
    auth_service.authenticated(req.session, 2)
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
