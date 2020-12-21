let User = require('../models/User');
let user_service = require('../services/User');

exports.add = function(req, res){
    let db = req.app.get('db');
    let user = req.body;
    user_service.addUser(db, user)
        .then(() => res.send('success'))
        .catch(() => res.status(400).send("fail"));
}

/*
exports.list = function(req, res){
    let db = req.app.get('db');
    salesman_service.readSalesman(db)
        .then(result => res.send(result))
        .catch(() => res.status(400).send("fail"));
}

exports.get = function(req, res){
    let db = req.app.get('db');
    salesman_service.readSalesman(db, req.params.id)
        .then(result => res.send(result))
        .catch(() => res.status(400).send("fail"));
}

exports.update = function(req, res){
    let db = req.app.get('db');
        let salesman = req.body;
        salesman_service.updateSalesman(db, salesman)
            .then(() => res.send('success'))
            .catch(() => res.status(400).send("fail"));
}

exports.remove = function(req, res) {
    let db = req.app.get('db');
    salesman_service.deleteSalesman(db, req.params.id)
        .then(() => res.send('success'))
        .catch(() => res.status(400).send("fail"));

}
 */