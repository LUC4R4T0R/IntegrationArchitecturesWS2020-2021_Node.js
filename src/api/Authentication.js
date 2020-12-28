const user_service = require('../services/User');
const auth_service = require('../services/Authentication');

exports.authenticate = function (req, res) {
    let db = req.app.get('db');
    user_service.verifyUser(db, req.body.username, req.body.password)
        .then(() => {
            auth_service.authenticate(req.session, req.body.username);
            res.send('success');
        })
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.isAuthenticated = function (req, res) {
    auth_service.authenticated(req.session).then(() => {
        res.send(true);
    }).catch(() =>{
            res.send(false);
    });
}

exports.deAuthenticate = function (req, res) {
    auth_service.deAuthenticate(req.session);
    res.send();
}

exports.currentUser = function (req, res) {
    res.send(req.session.user);
}