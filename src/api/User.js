
let user_service = require('../services/User');
let auth_service = require('../services/Authentication');

exports.create = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return user_service.addUser(db, req.body)
        })
        .then(() => res.send('success'))
        .catch(() => res.status(400).send("fail"));
}


exports.list = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return user_service.listUsers(db)
        })
        .then(result => res.send(result))
        .catch(() => res.status(400).send("fail"));
}

exports.find = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return user_service.getUser(db, req.params.username)
        })
        .then(result => res.send(result))
        .catch(() => res.status(400).send("fail"));
}

exports.update = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return user_service.updateUser(db, req.body)
        })
        .then(() => res.send('success'))
        .catch(() => res.status(400).send("fail"));
}

exports.remove = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return user_service.deleteUser(db, req.params.username)
        })
        .then(() => res.send('success'))
        .catch(() => res.status(400).send("fail"));
}