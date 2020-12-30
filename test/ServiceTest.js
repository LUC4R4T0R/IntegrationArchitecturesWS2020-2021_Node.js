//test requirements
let assert = require('assert');

//services
let record_service = require('../src/services/EvaluationRecord');

//models
let record = require('../src/models/EvaluationRecord');
let entry = require('../src/models/EvaluationRecordEntry');

//mongo DB
const fs = require('fs');
const mongodb = require('mongodb');
const rawConfig = fs.readFileSync('./config.json');
const config = JSON.parse(rawConfig);
const MongoClient = mongodb.MongoClient;
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
});

//----------------------------------------before and after------------------------------------------

let r = new record(2020);
let e = new entry("testName", 10, 10);

beforeEach(async function () {
    await db.collection("records").insertOne({id: 1, EvaluationRecord: r});
})

afterEach(function () {
    db.dropCollection("salesman");
    db.dropCollection("records");
});


//-------------------------------------------tests--------------------------------------------------
describe('create EvaluationRecord Test', function () {
    it('check if it worked', async function () {
        await record_service.createEvaluationRecord(db, "2", r);

        let res = await db.collection("records").findOne({id: 2, "EvaluationRecord.year": r.year});

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
            await record_service.createEvaluationRecord(db, "a", r);
        } catch (e) {
            assert.strictEqual(e.statusCode, 510);
        }
    })
    it('check if ElementDuplicateError is thrown', async function () {
        try {
            await record_service.createEvaluationRecord(db, "1", r);
        } catch (e) {
            assert.strictEqual(e.statusCode, 409);
        }
    })

});

describe('read EvaluationRecord Test', function () {
    it('check if MissingElementError is thrown', async function () {
        try {
            await record_service.readEvaluationRecord();
        } catch (e) {
            assert.strictEqual(e.statusCode, 400);
        }
    })
    describe('read all EvaluationRecord Test', function () {
        it('check if it worked', async function () {
            await db.collection("records").insertOne({id: 1, EvaluationRecord: new record(2021)});
            let ret = await record_service.readEvaluationRecord(db, "1")
            let res = await db.collection("records").find({id: 1}).toArray();

            assert.strictEqual(ret[0].id, res[0].id);
            assert.strictEqual(ret[0].EvaluationRecord.year, res[0].EvaluationRecord.year);
            assert.strictEqual(ret[1].id, res[1].id);
            assert.strictEqual(ret[1].EvaluationRecord.year, res[1].EvaluationRecord.year);
        })
        it('check if BadInputError is thrown', async function () {
            try {
                await record_service.readEvaluationRecord(db, "a");
            } catch (e) {
                assert.strictEqual(e.statusCode, 510);
            }
        })
        it('check if NoSuchElementError is thrown', async function () {
            try {
                await record_service.readEvaluationRecord(db, "10");
            } catch (e) {
                assert.strictEqual(e.statusCode, 404);
            }
        })
    });
    describe('read one EvaluationRecord Test', function () {
        it('check if BadInputError is thrown', async function () {
            try {
                await record_service.readEvaluationRecord(db, "a", "abc");
            } catch (e) {
                assert.strictEqual(e.statusCode, 510);
            }
        })
        it('check if NoSuchElementError is thrown', async function () {
            try {
                await record_service.readEvaluationRecord(db, "10", "2020");
            } catch (e) {
                assert.strictEqual(e.statusCode, 404);
            }
        })
        it('check if it worked', async function () {
            let ret = await record_service.readEvaluationRecord(db, "1", "2020");
            let res = await db.collection("records").find({
                id: 1,
                "EvaluationRecord.year": 2020
            }).toArray();

            assert.strictEqual(ret.id, res[0].id);
            assert.strictEqual(ret.EvaluationRecord.year, res[0].EvaluationRecord.year);
        })
    });
});

describe('delete one EvaluationRecord Test', function () {
    it('', function () {

    });
})
