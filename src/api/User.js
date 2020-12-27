let User = require('../models/User');
let user_service = require('../services/User');
let auth_service = require('../services/Authentication');

exports.add = function(req, res){
    try{
        auth_service.authenticated(req.session);
        let db = req.app.get('db');
        let user = req.body;
        user_service.addUser(db, user)
            .then(() => res.send('success'))
            .catch(() => res.status(400).send("fail"));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}


exports.list = function(req, res){
    try{
        auth_service.authenticated(req.session);
        let db = req.app.get('db');
        user_service.listUsers(db)
            .then(result => res.send(result))
            .catch(() => res.status(400).send("fail"));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}

exports.get = function(req, res){
    try{
        auth_service.authenticated(req.session);
        let db = req.app.get('db');
        user_service.getUser(db, req.params.username)
            .then(result => res.send(result))
            .catch(() => res.status(400).send("fail"));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}

exports.update = function(req, res){
    try {
        auth_service.authenticated(req.session);
        let db = req.app.get('db');
        let user = req.body;
        user_service.updateUser(db,user)
            .then(() => res.send('success'))
            .catch(() => res.status(400).send("fail"));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}

exports.remove = function(req, res) {
    try{
        auth_service.authenticated(req.session);
        let db = req.app.get('db');
        user_service.deleteUser(db, req.params.username)
            .then(() => res.send('success'))
            .catch(() => res.status(400).send("fail"));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}