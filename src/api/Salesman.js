let Salesman = require('../models/Salesman');
let salesman_service = require('../services/Salesman');
let auth_service = require('../services/Authentication');

exports.list = function(req, res){
    try{
        auth_service.authenticated(req.session);
        let orange = req.app.get('oHRM');
        salesman_service.readSalesman(orange)
            .then(result => res.send(result))
            .catch((error) =>  res.status(error.statusCode).send(error.message));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}

exports.find = function(req, res){
    try {
        auth_service.authenticated(req.session);
        let orange = req.app.get('oHRM');
        salesman_service.readSalesman(orange, req.params.id)
            .then(result => res.send(result))
            .catch((error) => res.status(error.statusCode).send(error.message));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}

exports.addBonus = function(req, res){
    try {
        auth_service.authenticated(req.session);
        let orange = req.app.get('oHRM');
        salesman_service.addBonus(orange, req.params.id, req.params.year, req.params.amount)
            .then(result => res.send(result))
            .catch((error) => res.status(error.statusCode).send(error.message));
    }catch(error){
        res.status(error.statusCode).send(error.message);
    }
}
