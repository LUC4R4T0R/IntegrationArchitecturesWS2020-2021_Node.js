const mongodb = require('mongodb');

async function connectMongoDB(app, config) {
    //starting database-connection and local API
    const MongoClient = mongodb.MongoClient;
    let auth = "";
    if (config["MongoDB_username"] !== "") {
        auth = config["MongoDB_username"] + ":" + config["MongoDB_username"] + "@";
    }
    await MongoClient.connect("mongodb://" + auth + config["MongoDB_domain"] + ":" + config["MongoDB_port"] + "/", function (err, database) {
        if (err) {
            throw err;
        }

        app.set('db', database.db(config["MongoDB_database"]));
    });
}

exports.connectMongoDB = connectMongoDB;
