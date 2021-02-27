const mongodb = require('mongodb');
const user_service = require('../services/UserService');
const User = require("../models/User");

let defaultSettings = {
    socialBonusBase: 0,
    socialBonusFactor: 100,
    salesBonusBase: 0,
    salesBonusFactor: 0.05,
    customerRatingFactor1: 1.5,
    customerRatingFactor2: 1.25,
    customerRatingFactor3: 1,
    customerRatingFactor4: 0.9,
    customerRatingFactor5: 0.8,
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
    await Promise.all([
        initSettings(app),
        addDefaultUser(app)
    ]);
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

async function addDefaultUser(app){
    let db = app.get('db');
    if((await db.collection('users').find({username: 'admin'}).toArray()).length < 1){
        await user_service.createUser(db, new User('admin', 'admin', 'admin', 4));
        console.warn('Default admin user-account created. Please change its password immediately!');
    }
}

exports.initMongoDB = initMongoDB;
