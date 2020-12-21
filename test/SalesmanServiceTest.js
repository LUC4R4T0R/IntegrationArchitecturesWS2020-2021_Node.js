let assert = require('assert');
let salesman_service = require('../src/services/Salesman');
const fs = require('fs');
const mongodb = require('mongodb');


//load config data
const rawConfig = fs.readFileSync('./config.json');
const config = JSON.parse(rawConfig);

//starting database-connection and local API
const MongoClient = mongodb.MongoClient;
let auth = "";
if (config["MongoDB_username"] !== ""){
    auth = config["MongoDB_username"] + ":" + config["MongoDB_username"] + "@";
}

let db;
MongoClient.connect("mongodb://"+ auth + config["MongoDB_domain"] + ":" + config["MongoDB_port"] + "/", function(err, database) {
    if(err) {
        throw err;
    }

    db = database.db(config["MongoDB_database"]);

});





describe('SalesmanTest', function() {
    describe('readSalesman', function() {
        it('return all Salesman', function() {
            salesman_service.readSalesman(db)
                .then((salesmen) => {
                    console.log(salesmen)
                });
        }),
        it('return all Salesman', function() {
            salesman_service.readSalesman(db)
                .then((salesmen) => {
                    console.log(salesmen)
                });
        });
    });
});
