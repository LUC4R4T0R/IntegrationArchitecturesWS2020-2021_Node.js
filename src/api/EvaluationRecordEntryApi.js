const evaluationRecordEntry_service = require('../services/EvaluationRecordEntryService');
const auth_service = require('../services/AuthenticationService');
const EvaluationRecordEntryApi = require('../models/EvaluationRecordEntry');
const BadInputError = require("../custom_errors/BadInputError");

exports.create = function (req, res) {
    auth_service.authenticated(req.session, 2)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecordEntry_service.createEvaluationRecordEntry(db, req.params.id, req.params.year, inputFilter(req.body));
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.list = function (req, res) {
    auth_service.authenticated(req.session, 1)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecordEntry_service.readAllEvaluationRecordEntries(db, req.params.id, req.params.year);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.find = function (req, res) {
    auth_service.authenticated(req.session, 1)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecordEntry_service.readOneEvaluationRecordEntry(db, req.params.id, req.params.year, req.params.name);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));

}

exports.update = function (req, res) {
    auth_service.authenticated(req.session, 2)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecordEntry_service.updateEvaluationRecordEntry(db, req.params.id, req.params.year, inputFilter(req.body));
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.remove = function (req, res) {
    auth_service.authenticated(req.session, 2)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecordEntry_service.deleteEvaluationRecordEntry(db, req.params.id, req.params.year, req.params.name);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}


function inputFilter(entry) {
    try {
        return new EvaluationRecordEntryApi(entry.name, entry.target, entry.actual);
    } catch (e) {
        throw new BadInputError('The given entry does not match the model of an entry!');
    }
}
