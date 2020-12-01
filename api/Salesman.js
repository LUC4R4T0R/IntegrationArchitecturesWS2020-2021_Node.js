var Salesman = require('../models/Salesman');
var managepersonal = require('../services/managepersonal');

exports.list = function(req, res){
    var db = req.app.get('db');
    (async () => {
        var result = await managepersonal.readSalesman(db);
        res.send(result);
    })();
}

exports.create = function(req, res){
    var db = req.app.get('db');
    let salesman = req.body;
    managepersonal.createSalesman(db, salesman);
    res.send('success');
}

exports.update = function(req, res){
    var db = req.app.get('db');
    let salesman = req.body;
    managepersonal.updateSalesman(db, salesman);
    res.send('success');
}

exports.find = function(req, res){
    var db = req.app.get('db');
    (async () => {
        var result = await managepersonal.readSalesman(db, req.params.id);
        res.send(result);
    })();
}

exports.remove = function(req, res){
    var db = req.app.get('db');
    managepersonal.deleteSalesman(db, req.params.id);
    res.send('success');
}