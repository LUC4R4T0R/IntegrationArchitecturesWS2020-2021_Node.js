const sinon = require('sinon');
require('sinon-mongo');
const record = require('../../src/models/EvaluationRecord');
const record_service = require('../../src/services/EvaluationRecord');
const assert = require('assert');

const mockRecordsCollection = sinon.mongo.collection();
const mockDb = sinon.mongo.db({
    records: mockRecordsCollection
});




beforeEach(function () {
    return null;
})

describe('EvaluationRecord test', function (){
    it('create record test', async function () {
        let test = false;
        mockRecordsCollection.findOne.withArgs({id:2, "EvaluationRecord.year": 2020}).resolves( null );
        mockRecordsCollection.insertOne.withArgs({id: 2, EvaluationRecord: new record(2020)}).resolves(test = true);
        await record_service.createEvaluationRecord(mockDb,"2", new record("2020"));
        assert.strictEqual(test,true);
    });
})
