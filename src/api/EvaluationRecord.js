const evaluationRecord_service = require('../services/EvaluationRecord');
const auth_service = require('../services/Authentication');
const record = require('../models/EvaluationRecord');
const BadInputError = require("../custom_errors/BadInputError");

exports.create = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            if (testIfBodyIsCorrect(req)) {
                return evaluationRecord_service.createEvaluationRecord(db, req.params.id, req.body);
            } else {
                throw new BadInputError();
            }
        })
        .then(() => res.send('success'))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.list = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecord_service.readEvaluationRecord(db, req.params.id);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.find = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecord_service.readEvaluationRecord(db, req.params.id, req.params.year);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
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

function testIfBodyIsCorrect(req) {
    let keysUser = Object.keys(new record(2020));
    let keysBody = Object.keys(req.body);
    return JSON.stringify(keysUser) === JSON.stringify(keysBody);
}