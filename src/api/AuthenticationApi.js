const user_service = require('../services/UserService');
const auth_service = require('../services/AuthenticationService');

exports.isAuthenticated = function (req, res) {
    auth_service.authenticated(req.session).then(() => {
        res.send(true);
    }).catch(() => {
        res.send(false);
    });
}

exports.authenticate = function (req, res) {
    let db = req.app.get('db');
    user_service.verifyUser(db, req.body.username, req.body.password)
        .then(async () => {
            await auth_service.authenticate(db, req.session, req.body.username);
            res.send('success');
        })
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.deAuthenticate = function (req, res) {
    auth_service.deAuthenticate(req.session);
    res.send();
}
