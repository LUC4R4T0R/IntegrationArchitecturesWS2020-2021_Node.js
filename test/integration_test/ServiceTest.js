//test requirements
const assert = require('assert');
const bcrypt = require('bcrypt');

//services
const record_service = require('../../src/services/EvaluationRecordService');
const entry_service = require('../../src/services/EvaluationRecordEntryService');
const user_service = require('../../src/services/UserService');

//models
const record = require('../../src/models/EvaluationRecord');
const entry = require('../../src/models/EvaluationRecordEntry');
const user = require('../../src/models/User');

//mongo DB
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const fs = require('fs');
const rawConfig = fs.readFileSync('./config.json');
const config = JSON.parse(rawConfig.toString());
let auth = "";
if (config["MongoDB_username"] !== "") {
    auth = config["MongoDB_username"] + ":" + config["MongoDB_username"] + "@";
}
let db;
MongoClient.connect("mongodb://" + auth + config["MongoDB_domain"] + ":" + config["MongoDB_port"] + "/", function (err, database) {
    if (err) {
        throw err;
    }
    db = database.db(config["MongoDB_database_test"]);
})

//test variables
let testEntry = new entry("testName", 10, 10);
let testRecord = new record(2020);
let testUser;

//-------------------------------------------tests--------------------------------------------------

//-----------------------------------EvaluationRecords----------------------------------------------
describe('test EvaluationRecords', function () {
    beforeEach(function () {
        return db.collection("records").insertOne({id: 10, EvaluationRecord: testRecord})
            .then(_ => {
                return db.dropCollection("records");
            })
            .then(_ => {
                return db.collection("records").insertOne({id: 1, EvaluationRecord: testRecord});
            });
    })
    describe('create EvaluationRecord test', function () {
        it('check if it worked', async function () {
            await record_service.createEvaluationRecord(db, "2", testRecord);

            let res = await db.collection("records").findOne({
                id: 2,
                "EvaluationRecord.year": testRecord.year
            });

            assert.strictEqual(res.id, 2);
            assert.strictEqual(res.EvaluationRecord.year, 2020);
        })
    });
    describe('read EvaluationRecord test', function () {
        describe('read all EvaluationRecord test', function () {
            it('check if it worked', async function () {
                await db.collection("records").insertOne({
                    id: 1,
                    EvaluationRecord: new record(2021)
                });
                let ret = await record_service.readAllEvaluationRecords(db, "1")
                let res = await db.collection("records").find({id: 1}).toArray();

                assert.strictEqual(ret[0].year, res[0].EvaluationRecord.year);
                assert.strictEqual(ret[1].year, res[1].EvaluationRecord.year);
            })
        });
        describe('read one EvaluationRecord test', function () {
            it('check if it worked', async function () {
                let ret = await record_service.readOneEvaluationRecord(db, "1", "2020");
                let res = await db.collection("records").find({
                    id: 1,
                    "EvaluationRecord.year": 2020
                }).toArray();

                assert.strictEqual(ret.year, res[0].EvaluationRecord.year);
            })
        });
    });
    describe('delete one EvaluationRecord test', function () {
        it('check if it worked', async function () {
            await record_service.deleteEvaluationRecord(db, "1", "2020");
            let ret = await db.collection("records").findOne({
                id: 1,
                "EvaluationRecord.year": 2020
            });

            assert.strictEqual(ret, null);
        });
    })
})

//-----------------------------------EvaluationRecordEntries----------------------------------------
describe('test EvaluationRecordEntries', function () {
    beforeEach(function () {
        return db.collection("records").insertOne({id: 10, EvaluationRecord: testRecord})
            .then(_ => {
                return db.dropCollection("records");
            })
            .then(_ => {
                return db.collection("records").insertOne({id: 1, EvaluationRecord: testRecord});
            });
    })
    describe('create one EvaluationRecordEntry test', function () {
        it('check if it worked', async function () {
            await entry_service.createEvaluationRecordEntry(db, "1", "2020", testEntry);
            let res = await db.collection("records").findOne({
                id: 1,
                "EvaluationRecord.year": 2020
            });

            assert.strictEqual(res.id, 1);
            assert.strictEqual(res.EvaluationRecord.year, 2020);
            assert.strictEqual(res.EvaluationRecord.entries[0].name, "testName");
        });
    })
    describe('read EvaluationRecordEntry test', function () {
        it('check if it worked', async function () {
            await entry_service.createEvaluationRecordEntry(db, "1", "2020", testEntry);
            await entry_service.readOneEvaluationRecordEntry(db, "1", "2020", "testName");
            let res = (await db.collection("records").findOne({
                id: 1,
                "EvaluationRecord.year": 2020
            }))
                .EvaluationRecord.entries[0];

            assert.strictEqual(res.name, "testName");
            assert.strictEqual(res.target, 10);
            assert.strictEqual(res.actual, 10);
        });
    })
    describe('read all EvaluationRecordEntry test', function () {
        it('check if it worked', async function () {
            await entry_service.createEvaluationRecordEntry(db, "1", "2020", testEntry);
            await entry_service.readAllEvaluationRecordEntries(db, "1", "2020");
            let res = (await db.collection("records").findOne({
                id: 1,
                "EvaluationRecord.year": 2020
            }))
                .EvaluationRecord.entries[0];

            assert.strictEqual(res.name, "testName");
            assert.strictEqual(res.target, 10);
            assert.strictEqual(res.actual, 10);
        });
    })
    describe('update EvaluationRecordEntry test', function () {
        it('check if it worked', async function () {
            await entry_service.createEvaluationRecordEntry(db, "1", "2020", testEntry);
            await entry_service.updateEvaluationRecordEntry(db, "1", "2020", new entry("testName", 1, 1));
            let res = (await db.collection("records").findOne({
                id: 1,
                "EvaluationRecord.year": 2020
            }))
                .EvaluationRecord.entries[0];

            assert.strictEqual(res.name, "testName");
            assert.strictEqual(res.target, 1);
            assert.strictEqual(res.actual, 1);
        });
    })

    describe('delete EvaluationRecordEntry test', function () {
        it('check if it worked', async function () {
            await entry_service.createEvaluationRecordEntry(db, "1", "2020", testEntry);
            await entry_service.deleteEvaluationRecordEntry(db, "1", "2020", "testName");
            let res = (await db.collection("records").findOne({
                id: 1,
                "EvaluationRecord.year": 2020
            }))
                .EvaluationRecord.entries[0];

            assert.strictEqual(res, undefined);
        });
    })
})
//---------------------------------------------Users------------------------------------------------
describe('test User', function () {

    beforeEach(function () {
        return db.collection("users").insertOne({})
            .then(_ => {
                return db.dropCollection("users");
            })
            .then(() => {
                return bcrypt.hash("1234", 10);
            })
            .then((pw) => {
                testUser = new user("test", "jonas", pw);
                return db.collection("users").insertOne(testUser);
            });
    })

    describe('create User test', function () {
        it('check if it worked', async function () {
            await user_service.createUser(db, new user("hallo", "luca", "1234"));
            let res = await db.collection('users').findOne({username: "luca"});

            assert.strictEqual(res.displayname, "hallo");
            assert.strictEqual(res.username, "luca");
            assert.strictEqual(await bcrypt.compare("1234", res.password), true);
        });
    })
    describe('read User test', function () {
        describe('read all User test', function () {
            it('should work', async function () {
                let result = await user_service.readAllUsers(db);

                let result2 = await db.collection('users').find().toArray();

                assert.strictEqual(result.displayname, result2.displayname)
            });
        })
        describe('read one User test', function () {
            it('should work', async function () {
                let result = await user_service.readOneUser(db, "jonas");

                let result2 = await db.collection('users').findOne({username: "jonas"});

                assert.strictEqual(result.username, result2.username);
            });
        })
    })
    describe('update User test', function () {
        it('should work', async function () {
            await user_service.updateUser(db, new user("neu", "jonas"));

            let result = await db.collection("users").findOne({username: "jonas"});

            assert.strictEqual(result.displayname, "neu");
        });
    })
    describe('delete User test', function () {
        it('should work', async function () {
            await user_service.deleteUser(db, "jonas");

            let result = await db.collection("users").findOne({username: "jonas"});

            assert.strictEqual(result, null);
        });
    })
})
