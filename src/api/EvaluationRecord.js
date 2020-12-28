let evaluationRecord_service = require('../services/EvaluationRecord');
let auth_service = require('../services/Authentication');


exports.create = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecord_service.createEvaluationRecord(db, req.params.id, req.body);
        })
        .then(() => res.send('success'))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.list = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecord_service.readEvaluationRecord(db, req.params.id)
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.find = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecord_service.readEvaluationRecord(db, req.params.id, req.params.year)
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}


exports.remove = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return evaluationRecord_service.deleteEvaluationRecord(db, req.params.id, req.params.year)
        })
        .then(() => res.send('success'))
        .catch((error) => res.status(error.statusCode).send(error.message));

}