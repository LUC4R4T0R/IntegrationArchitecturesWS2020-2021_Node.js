let user_service = require('../services/User');
let auth_service = require('../services/Authentication');

exports.authenticate = function (req, res) {
    let db = req.app.get('db');
    user_service.verifyUser(db, req.body.username, req.body.password)
        .then(() => {
            auth_service.authenticate(req.session);
            res.send('success');
        })
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.deAuthenticate = function (req, res) {
    auth_service.deAuthenticate(req.session);
    res.send();
}