let user_service = require('../services/User');

exports.authenticate = function (req, res){
    let db = req.app.get('db');
    user_service.verifyUser(db, req.body.username, req.body.password)
        .then(() => {
            req.session.loggedIn = true;
            res.send("success");
        })
        .catch(() => res.status(400).send("fail"));
}

exports.deAuthenticate = function (req, res){
    req.session.destroy();
}