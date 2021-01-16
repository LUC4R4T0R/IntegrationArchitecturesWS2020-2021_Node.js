//test requirements
const assert = require('assert');
const bcrypt = require('bcrypt');

//services
const record_service = require('../../src/services/EvaluationRecord');
const entry_service = require('../../src/services/EvaluationRecordEntry');
const user_service = require('../../src/services/User');

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
        it('check if MissingElementError is thrown', async function () {
            try {
                await record_service.createEvaluationRecord();
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        })
        it('check if BadInputError is thrown', async function () {
            try {
                await record_service.createEvaluationRecord(db, "a", testRecord);
            } catch (e) {
                assert.strictEqual(e.statusCode, 510);
            }
        })
        it('check if ElementDuplicateError is thrown', async function () {
            try {
                await record_service.createEvaluationRecord(db, "1", testRecord);
            } catch (e) {
                assert.strictEqual(e.statusCode, 409);
            }
        })

    });

    describe('read EvaluationRecord test', function () {
        it('check if MissingElementError is thrown', async function () {
            try {
                await record_service.readOneEvaluationRecord();
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        })
        describe('read all EvaluationRecord test', function () {
            it('check if it worked', async function () {
                await db.collection("records").insertOne({
                    id: 1,
                    EvaluationRecord: new record(2021)
                });
                let ret = await record_service.readAllEvaluationRecord(db, "1")
                let res = await db.collection("records").find({id: 1}).toArray();

                assert.strictEqual(ret[0].year, res[0].EvaluationRecord.year);
                assert.strictEqual(ret[1].year, res[1].EvaluationRecord.year);
            })
            it('check if BadInputError is thrown', async function () {
                try {
                    await record_service.readAllEvaluationRecord(db, "a");
                } catch (e) {
                    assert.strictEqual(e.statusCode, 510);
                }
            })
            it('check if empty array is returned', async function () {
                let ret = await record_service.readAllEvaluationRecord(db, "10");
                assert.strictEqual(ret.length, 0);
            })
        });
        describe('read one EvaluationRecord test', function () {
            it('check if BadInputError is thrown', async function () {
                try {
                    await record_service.readOneEvaluationRecord(db, "a", "abc");
                } catch (e) {
                    assert.strictEqual(e.statusCode, 510);
                }
            })
            it('check if NoSuchElementError is thrown', async function () {
                try {
                    await record_service.readOneEvaluationRecord(db, "10", "2020");
                } catch (e) {
                    assert.strictEqual(e.statusCode, 404);
                }
            })
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
        it('check if MissingInputError is thrown', async function () {
            try {
                await record_service.deleteEvaluationRecord(db);
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        it('check if BadInputError is thrown', async function () {
            try {
                await record_service.deleteEvaluationRecord(db, "a", "2020");
            } catch (e) {
                assert.strictEqual(e.statusCode, 510);
            }
        });
        it('check if NoSuchElementError is thrown', async function () {
            try {
                await record_service.deleteEvaluationRecord(db, "10", "2020");
            } catch (e) {
                assert.strictEqual(e.statusCode, 404);
            }
        });
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
        it('check if MissingElementError is thrown', async function () {
            try {
                await entry_service.createEvaluationRecordEntry(db);
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        it('check if BadInputError is thrown', async function () {
            try {
                await entry_service.createEvaluationRecordEntry(db, "a", "2020", testEntry);
            } catch (e) {
                assert.strictEqual(e.statusCode, 510);
            }
        });
        it('check if ElementDuplicateError is thrown', async function () {
            try {
                await entry_service.createEvaluationRecordEntry(db, "1", "2020", testEntry);
                await entry_service.createEvaluationRecordEntry(db, "1", "2020", testEntry);
            } catch (e) {
                assert.strictEqual(e.statusCode, 409);
            }
        });
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
        it('check if MissingElementError is thrown', async function () {
            try {
                await entry_service.readOneEvaluationRecordEntry(db);
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        describe('read one EvaluationRecordEntry test', function () {
            it('check if BadInputError is thrown', async function () {
                try {
                    await entry_service.readOneEvaluationRecordEntry(db, "a", "2020", "name");
                } catch (e) {
                    assert.strictEqual(e.statusCode, 510);
                }
            });
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
            it('check if BadInputError is thrown', async function () {
                try {
                    await entry_service.readAllEvaluationRecordEntry(db, "a", "2020");
                } catch (e) {
                    assert.strictEqual(e.statusCode, 510);
                }
            });
            it('check if it worked', async function () {
                await entry_service.createEvaluationRecordEntry(db, "1", "2020", testEntry);
                await entry_service.readAllEvaluationRecordEntry(db, "1", "2020");
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
    })

    describe('update EvaluationRecordEntry test', function () {
        it('check if MissingElementError is thrown', async function () {
            try {
                await entry_service.updateEvaluationRecordEntry(db);
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        it('check if BadInputError is thrown', async function () {
            try {
                await entry_service.updateEvaluationRecordEntry(db, "a", "2020", testEntry);
            } catch (e) {
                assert.strictEqual(e.statusCode, 510);
            }
        });
        it('check if NoSuchElementError is thrown', async function () {
            try {
                await entry_service.updateEvaluationRecordEntry(db, "1", "2020", new entry("test", 1, 1));
            } catch (e) {
                assert.strictEqual(e.statusCode, 404);
            }
        });
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
        it('check if MissingElementError is thrown', async function () {
            try {
                await entry_service.deleteEvaluationRecordEntry(db);
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        it('check if BadInputError is thrown', async function () {
            try {
                await entry_service.deleteEvaluationRecordEntry(db, "a", "2020", "testName");
            } catch (e) {
                assert.strictEqual(e.statusCode, 510);
            }
        });
        it('check if NoSuchElementError is thrown', async function () {
            try {
                await entry_service.updateEvaluationRecordEntry(db, "1", "2020", new entry("test", 1, 1));
            } catch (e) {
                assert.strictEqual(e.statusCode, 404);
            }
        });
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
        it('check if MissingElementError is thrown', async function () {
            try {
                await user_service.createUser();
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        })
        it('check if ElementDuplicateError is thrown', async function () {
            try {
                await user_service.createUser(db, testUser);
            } catch (e) {
                assert.strictEqual(e.statusCode, 409);
            }
        })
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

        })
        describe('read one User test', function () {

        })
    })
    describe('update User test', function () {
        it('check if MissingElementError is thrown', async function () {
            try {
                await user_service.updateUser();
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        })
    })
    describe('delete User test', function () {
        it('check if MissingElementError is thrown', async function () {
            try {
                await user_service.deleteUser();
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        })
    })
})
