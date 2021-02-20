const auth_service = require('../services/AuthenticationService');
const settings_service = require('../services/SettingsService');

exports.getSetting = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return settings_service.getSetting(db, req.params.name);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.setSetting = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return settings_service.setSetting(db, req.body);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}