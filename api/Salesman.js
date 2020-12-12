let Salesman = require('../models/Salesman');
let salesman_service = require('../services/Salesman');

/*exports.create = function(req, res){
    let db = req.app.get('db');
    let salesman = req.body;
    salesman_service.createSalesman(db, salesman)
        .then(() => res.send('success'))
        .catch(() => res.status(400).send("fail"));
}*/

exports.list = function(req, res){
    let db = req.app.get('db');
    salesman_service.readSalesman(db)
        .then(result => res.send(result))
        .catch(() => res.status(400).send("fail"));
}

exports.find = function(req, res){
    let db = req.app.get('db');
    salesman_service.readSalesman(db, req.params.id)
        .then(result => res.send(result))
        .catch(() => res.status(400).send("fail"));
}

/*exports.update = function(req, res){
    let db = req.app.get('db');
        let salesman = req.body;
        salesman_service.updateSalesman(db, salesman)
            .then(() => res.send('success'))
            .catch(() => res.status(400).send("fail"));
}*/

/*exports.remove = function(req, res) {
    let db = req.app.get('db');
    salesman_service.deleteSalesman(db, req.params.id)
        .then(() => res.send('success'))
        .catch(() => res.status(400).send("fail"));

}*/