let Salesman = require('../models/Salesman');
let salesman_service = require('../services/Salesman');
let auth_service = require('../services/Authentication');

exports.list = function(req, res){
    try{
        auth_service.authenticated(req.session);
        let db = req.app.get('db');
        salesman_service.readSalesman(db)
            .then(result => res.send(result))
            .catch((error) =>  res.status(error.statusCode).send(error.message));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}

exports.find = function(req, res){
    try {
        auth_service.authenticated(req.session);
        let db = req.app.get('db');
        salesman_service.readSalesman(db, req.params.id)
            .then(result => res.send(result))
            .catch((error) => res.status(error.statusCode).send(error.message));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}
