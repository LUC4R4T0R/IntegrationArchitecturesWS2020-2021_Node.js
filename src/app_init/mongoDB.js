const mongodb = require('mongodb');

let defaultSettings = {
    socialBonusBase: 0,
    socialBonusFactor: 1,
    salesBonusBase: 0,
    salesBonusFactor: 1,
    customerRatingFactor1: 2,
    customerRatingFactor2: 1.5,
    customerRatingFactor3: 1,
    customerRatingFactor4: 0.75,
    customerRatingFactor5: 0.5,
    evaluationRecordEntryNames:[
        'Leadership Competence',
        'Openness to Employee',
        'Social Behaviour to Employee',
        'Attitude towards Client',
        'Communication Skills',
        'Integrity to Company'
    ]
}

async function initMongoDB(app, config){
    await connectMongoDB(app, config);
    await initSettings(app);
}

async function connectMongoDB(app, config) {
    //starting database-connection and local API
    const MongoClient = mongodb.MongoClient;
    let auth = "";
    if (config["MongoDB_username"] !== "") {
        auth = config["MongoDB_username"] + ":" + config["MongoDB_username"] + "@";
    }
    const database = await MongoClient.connect("mongodb://" + auth + config["MongoDB_domain"] + ":" + config["MongoDB_port"] + "/")
        .catch(err => {throw err});
    await app.set('db', database.db(config["MongoDB_database"]));
}

async function initSettings(app){
    let db = app.get('db');

    for(let [name, value] of Object.entries(defaultSettings)){
        db.collection('settings').updateOne(
            {name: name},
            {$setOnInsert: {name: name, value: value}},
            {upsert: true}
        );
    }

}

exports.initMongoDB = initMongoDB;
