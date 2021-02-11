const salesman_service = require('../services/SalesmanService');
const auth_service = require('../services/Authentication');

exports.addBonus = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let orange = req.app.get('oHRM');
            return salesman_service.addBonus(orange, req.params.id, req.params.year, req.params.amount);
        })

        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.getAll = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let orange = req.app.get('oHRM');
            return salesman_service.readAllSalesman(orange);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.getOne = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let orange = req.app.get('oHRM');
            return salesman_service.readOneSalesman(orange, req.params.id);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.addRemark = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let orange = req.app.get('oHRM');
            return salesman_service.readOneSalesman(orange, req.params.id);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.listOrders = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return salesman_service.addRemark(db, req.params.id, req.params.year , req.body.remark);
        })
        .then(result => {
            res.send(result);
        });
}
