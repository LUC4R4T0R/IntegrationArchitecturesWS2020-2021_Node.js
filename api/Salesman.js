var Salesman = require('../models/Salesman');
var salesman_service = require('../services/Salesman');

exports.list = function(req, res){
    var db = req.app.get('db');
    (async () => {
        var result = await salesman_service.readSalesman(db);
        res.send(result);
    })();
}

exports.create = function(req, res){
    var db = req.app.get('db');
    let salesman = req.body;
    salesman_service.createSalesman(db, salesman);
    res.send('success');
}

exports.update = function(req, res){
    var db = req.app.get('db');
    let salesman = req.body;
    salesman_service.updateSalesman(db, salesman);
    res.send('success');
}

exports.find = function(req, res){
    var db = req.app.get('db');
    (async () => {
        var result = await salesman_service.readSalesman(db, req.params.id);
        res.send(result);
    })();
}

exports.remove = function(req, res){
    var db = req.app.get('db');
    salesman_service.deleteSalesman(db, req.params.id);
    res.send('success');
}