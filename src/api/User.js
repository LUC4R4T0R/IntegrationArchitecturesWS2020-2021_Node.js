const user_service = require('../services/User');
const auth_service = require('../services/Authentication');
const user = require('../models/User');
const BadInputError = require("../custom_errors/BadInputError");

exports.create = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            if (testIfBodyIsCorrect(req)) {
                return user_service.addUser(db, req.body);
            } else {
                throw new BadInputError()
            }
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}


exports.list = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return user_service.listUsers(db);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.find = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            if (parseInt(req.params.username) === -1){
                return user_service.getUser(db, req.session.user);
            }
            return user_service.getUser(db, req.params.username);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.update = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            if (testIfBodyIsCorrect(req)) {
                return user_service.updateUser(db, req.body);
            } else {
                throw new BadInputError()
            }
        })
        .then(() => res.send('success'))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.remove = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return user_service.deleteUser(db, req.params.username);
        })
        .then(() => res.send('success'))
        .catch((error) => res.status(error.statusCode).send(error.message));
}


function testIfBodyIsCorrect(req) {
    let keysUser = Object.keys(new user('', '', ''));
    let keysBody = Object.keys(req.body);
    return JSON.stringify(keysUser) === JSON.stringify(keysBody);
}