const salesman_service = require('../services/SalesmanService');
const auth_service = require('../services/AuthenticationService');
let OpenCRX = require('../connectors/OpenCRX');

exports.addBonus = function (req, res) {
    auth_service.authenticated(req.session, 2)
        .then(() => {
            let orange = req.app.get('oHRM');
            return salesman_service.addBonus(orange, req.params.id, req.params.year, req.params.amount);
        })

        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.list = function (req, res) {
    auth_service.authenticated(req.session, 2)
        .then(() => {
            let orange = req.app.get('oHRM');
            return salesman_service.readAllSalesman(orange);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.find = function (req, res) {
    auth_service.authenticated(req.session, 1)
        .then(() => {
            let orange = req.app.get('oHRM');
            return salesman_service.readOneSalesman(orange, req.params.id);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.addRemark = function (req, res) {
    auth_service.authenticated(req.session, 3)
        .then(() => {
            let db = req.app.get('db');
            return salesman_service.addRemark(db, req.params.id, req.params.year, req.body.remarks)
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.renewOrder = function (req, res) {
    auth_service.authenticated(req.session, 2)
        .then(() => {
            let db = req.app.get('db');
            let open = req.app.get('oCRX');
            return salesman_service.renewOrder(open, req.params.id, req.params.year, db);
        })
        .then(result => {
            res.send(result);
        });
}

exports.getOrder = function (req, res) {
    auth_service.authenticated(req.session, 2)
        .then(() => {
            let db = req.app.get('db');
            let open = req.app.get('oCRX');
            return salesman_service.getOrder(open, req.params.id, req.params.year, db);
        })
        .then(result => {
            res.send(result);
        });
}

exports.getYearsOfOrders = function (req, res) {
    auth_service.authenticated(req.session, 1)
        .then(() => {
            let open = req.app.get('oCRX');
            return salesman_service.getYearsOfOrders(open, req.params.id);
        })
        .then(result => {
            res.send(result);
        });
}

exports.approve = function (req, res) {
    auth_service.authenticated(req.session, 1)
        .then(() => {
            let db = req.app.get('db');
            return salesman_service.approve(db, req.params.id, req.params.year, req.session.group);
        })
        .then(result => {
            res.send(result);
        });
}
