let Salesman = require('../models/Salesman');
let salesman_service = require('../services/Salesman');

/*exports.create = function(req, res){
    let db = req.app.get('db');
    let salesman = req.body;
    salesman_service.createSalesman(db, salesman)
        .then(() => res.send('success'))
        .catch((error) => res.status(error.statusCode).send(error.message));
}*/

exports.list = function(req, res){
    let db = req.app.get('db');
    salesman_service.readSalesman(db)
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.find = function(req, res){
    let db = req.app.get('db');
    salesman_service.readSalesman(db, req.params.id)
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

/*exports.update = function(req, res){
    let db = req.app.get('db');
    let salesman = req.body;
    salesman_service.updateSalesman(db, salesman)
        .then(() => res.send('success'))
        .catch((error) => res.status(error.statusCode).send(error.message));
}*/

/*exports.remove = function(req, res) {
    let db = req.app.get('db');
    salesman_service.deleteSalesman(db, req.params.id)
        .then(() => res.send('success'))
        .catch((error) => res.status(error.statusCode).send(error.message));

}*/