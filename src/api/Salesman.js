const salesman_service = require('../services/Salesman');
const auth_service = require('../services/Authentication');

exports.list = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let orange = req.app.get('oHRM');
            return salesman_service.readSalesman(orange);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.find = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let orange = req.app.get('oHRM');
            return salesman_service.readSalesman(orange, req.params.id);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.addBonus = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let orange = req.app.get('oHRM');
            return salesman_service.addBonus(orange, req.params.id, req.params.year, req.params.amount);
        })

        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.addRemark = function (req, res) {
}

exports.listOrders = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            return salesman_service.listOrders(req.params.id, req.params.year);
        })
        .then(result => {
            res.send(result);
        });
}
