let Salesman = require('../models/Salesman');
let salesman_service = require('../services/Salesman');

exports.list = function(req, res){
    let db = req.app.get('db');
    salesman_service.readSalesman(db)
        .then(result => res.send(result))
        .catch((error) =>  res.status(error.statusCode).send(error.message));
}

exports.find = function(req, res){
    let db = req.app.get('db');
    salesman_service.readSalesman(db, req.params.id)
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}
