const sinon = require('sinon');
require('sinon-mongo');
const assert = require('assert');

const bcrypt = require("bcrypt");

const record = require('../../src/models/EvaluationRecord');
const record_service = require('../../src/services/EvaluationRecordService');
const user_service = require('../../src/services/UserService');
const authentication_service = require('../../src/services/AuthenticationService');
const settings_service = require('../../src/services/SettingsService');

//mocked collections
const mockRecordsCollection = sinon.mongo.collection();
const mockReviewCollection = sinon.mongo.collection();
const mockSettingsCollection = sinon.mongo.collection();
const mockUsersCollection = sinon.mongo.collection();
const mockDb = sinon.mongo.db({
    records: mockRecordsCollection,
    review: mockReviewCollection,
    settings: mockSettingsCollection,
    users: mockUsersCollection
});

describe('AuthenticationService tests', function () {
    describe('authenticated method', function () {
        it('should work', async function () {
            let session = {
                loggedIn: true,
                group: 3
            };
            await authentication_service.authenticated(session, 1);
        });
        it('should throw Error caused by no session', async function () {
            let session = undefined;
            try {
                await authentication_service.authenticated(session, 1);
            } catch (e) {
                assert.strictEqual(e.statusCode, 401);
            }
        });
        it('should throw Error caused by not being logged in', async function () {
            let session = {
                loggedIn: false,
                group: 3
            }
            try {
                await authentication_service.authenticated(session, 1);
            } catch (e) {
                assert.strictEqual(e.statusCode, 401);
            }
        });
        it('should throw Error caused by to low group', async function () {
            let session = {
                loggedIn: false,
                group: 0
            }
            try {
                await authentication_service.authenticated(session, 1);
            } catch (e) {
                assert.strictEqual(e.statusCode, 401);
            }
        });
    })
    describe('authenticate method', function () {
        it('should work', async function () {
            let session = {
                user: "",
                loggedIn: false,
                group: 0
            };
            mockUsersCollection.findOne.withArgs({
                username: "jonas"
            }).resolves({group: 1});

            await authentication_service.authenticate(mockDb, session, "jonas");

            assert.strictEqual(session.user, "jonas");
            assert.strictEqual(session.loggedIn, true);
            assert.strictEqual(session.group, 1);
        });
    })
    describe('deAuthenticate method', function () {
        it('should work', async function () {
            let session = {
                loggedIn: true,
                destroy() {
                }
            };
            await authentication_service.deAuthenticate(session);
            assert.strictEqual(session.loggedIn, false);
        });
    })
})

describe('SettingsService tests', function () {
    describe('getSettings method', function () {
        it('should work', async function () {
            mockSettingsCollection.findOne.withArgs({
                name: "test"
            }).resolves(10);

            let result = await settings_service.getSetting(mockDb, "test");

            assert.strictEqual(result, 10);
        });
        it('should throw error caused by missing param', async function () {
            try {
                await settings_service.getSetting(mockDb);
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        it('should throw error caused by no such setting', async function () {
            mockSettingsCollection.findOne.withArgs({
                name: "test"
            }).resolves(null);

            try {
                await settings_service.getSetting(mockDb, "test");
            } catch (e) {
                assert.strictEqual(e.statusCode, 404);
            }
        });
    })
    describe('setSettings method', function () {
        it('should work', async function () {
            let setting = {
                name: "test",
                value: 10
            }
            mockSettingsCollection.findOne.withArgs({
                name: "test"
            }).resolves(5);
            mockSettingsCollection.findOneAndUpdate.withArgs({
                name: "test"
            }, {
                value: 10
            }).resolves();

            await settings_service.setSetting(mockDb, setting);
        });
        it('should throw error caused by missing param', async function () {
            try {
                await settings_service.setSetting(mockDb);
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        it('should throw error caused by no such setting', async function () {
            let setting = {
                name: "test",
                value: 10
            }
            mockSettingsCollection.findOne.withArgs({
                name: "test"
            }).resolves(null);

            try {
                await settings_service.setSetting(mockDb, setting);
            } catch (e) {
                assert.strictEqual(e.statusCode, 404);
            }
        });
    })
})

describe('UserService tests', function () {
    describe('createUser method', function () {
        it('should work', async function () {
            let user = {
                displayname: "test",
                username: "test",
                password: "12345678",
                group: 5,
                employeeId: 111
            }
            mockUsersCollection.findOne.withArgs({
                username: "test"
            }).resolves(null);
            mockUsersCollection.insertOne.withArgs({
                user: user
            }).resolves();

            await user_service.createUser(mockDb, user);
        });
        it('should throw error caused by missing param', async function () {
            try {
                await user_service.createUser(mockDb);
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        it('should throw error caused by bad password', async function () {
            let user = {
                displayname: "test",
                username: "test",
                password: 12345678,
                group: 5,
                employeeId: 111
            }
            mockUsersCollection.findOne.withArgs({
                username: "test"
            }).resolves(null);

            try {
                await user_service.createUser(mockDb, user);
            } catch (e) {
                assert.strictEqual(e.message.startsWith("Unable to hash password!"), true);
            }
        });
        it('should throw error caused by duplicate user', async function () {
            let user = {
                displayname: "test",
                username: "test",
                password: 12345678,
                group: 5,
                employeeId: 111
            }
            mockUsersCollection.findOne.withArgs({
                username: "test"
            }).resolves(10);

            try {
                await user_service.createUser(mockDb, user);
            } catch (e) {
                assert.strictEqual(e.statusCode, 409);
            }
        });
    })
    describe('readAllUsers method', function () {
        it('should work', async function () {
            let user1 = {
                displayname: "test",
                username: "test",
                password: "12345678",
                group: 5,
                employeeId: 111
            }
            let user2 = {
                displayname: "test",
                username: "test",
                password: "12345678",
                group: 5
            }
            //with employeeId
            mockUsersCollection.find.withArgs().returns(sinon.mongo.documentArray([user1]));

            let result1 = await user_service.readAllUsers(mockDb);
            assert.strictEqual(result1[0].employeeId, user1.employeeId);

            //without employeeId
            mockUsersCollection.find.withArgs().returns(sinon.mongo.documentArray([user1]));

            let result2 = await user_service.readAllUsers(mockDb);
            assert.strictEqual(result2[0].username, user2.username);
        });
        it('should throw error caused by missing param', async function () {
            try {
                await user_service.readAllUsers();
            } catch (e) {
                assert.strictEqual(e.statusCode, 400)
            }
        });
        it('should work (return empty array)', async function () {
            mockUsersCollection.find.withArgs().returns(sinon.mongo.documentArray(null));

            let result = await user_service.readAllUsers(mockDb);

            assert.strictEqual(result[0], undefined)
        });
    })
    describe('readOneUser method', function () {
        it('should work', async function () {
            let user1 = {
                displayname: "test",
                username: "test",
                password: "12345678",
                group: 5,
                employeeId: 111
            }
            let user2 = {
                displayname: "test",
                username: "test",
                password: "12345678",
                group: 5
            }

            //with employeeId
            mockUsersCollection.findOne.withArgs({
                username: "test"
            }).resolves(user1);

            let result1 = await user_service.readOneUser(mockDb, "test");
            assert.strictEqual(result1.employeeId, 111);


            //without employeeId
            mockUsersCollection.findOne.withArgs({
                username: "test"
            }).resolves(user2);

            let result2 = await user_service.readOneUser(mockDb, "test");
            assert.strictEqual(result2.username, "test");
        });
        it('should trow error caused by missing param', async function () {
            try {
                await user_service.readOneUser(mockDb);
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        it('should throw error caused by no such user', async function () {
            mockUsersCollection.findOne.withArgs({
                username: "test"
            }).resolves(null);

            try {
                await user_service.readOneUser(mockDb, "test");
            } catch (e) {
                assert.strictEqual(e.statusCode, 404);
            }
        });
    })
    describe('updateUser method', function () {
        it('should work', async function () {
            let user = {
                displayname: "test",
                username: "test",
                password: "12345678",
                group: 5,
                employeeId: 111
            }
            mockUsersCollection.findOne.withArgs({
                username: "test"
            }).resolves(user);
            mockUsersCollection.findOneAndUpdate.withArgs({
                username: "test"
            }, {
                displayname: "test1",
                employeeId: 112,
                group: 1
            }).resolves();

            await user_service.updateUser(mockDb, user);
        });
        it('should throw error caused by missing param', async function () {
            try {
                await user_service.updateUser(mockDb);
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        it('should throw error caused by no such user', async function () {
            let user = {
                displayname: "test",
                username: "test",
                password: "12345678",
                group: 5,
                employeeId: 111
            }
            mockUsersCollection.findOne.withArgs({
                username: "test"
            }).resolves(null);

            try {
                await user_service.updateUser(mockDb, user);
            } catch (e) {
                assert.strictEqual(e.statusCode, 404);
            }
        });
    })
    describe('updateUserPW method', function () {
        it('should work', async function () {
            let user = {
                displayname: "test",
                username: "test",
                password: await bcrypt.hash("12345", 10),
                group: 5,
                employeeId: 111
            }
            mockUsersCollection.findOne.withArgs({
                username: "test"
            }).resolves(user);
            mockUsersCollection.findOneAndUpdate.withArgs({
                username: "test"
            }, {
                password: "123"
            }).resolves();

            await user_service.updateUserPW(mockDb, "test", "12345", "123");
        });
        it('should throw error caused by missing param', async function () {
            try {
                await user_service.updateUserPW(mockDb);
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        it('should throw error caused by wrong password', async function () {
            let user = {
                displayname: "test",
                username: "test",
                password: await bcrypt.hash("12345", 10),
                group: 5,
                employeeId: 111
            }
            mockUsersCollection.findOne.withArgs({
                username: "test"
            }).resolves(user);
            mockUsersCollection.findOneAndUpdate.withArgs({
                username: "test"
            }, {
                password: "123"
            }).resolves();

            try {
                await user_service.updateUserPW(mockDb, "test", "123", "123");
            } catch (e) {
                assert.strictEqual(e.statusCode, 401);
            }
        });
        it('should throw error caused by no such user', async function () {
            let user = {
                displayname: "test",
                username: "test",
                password: await bcrypt.hash("12345", 10),
                group: 5,
                employeeId: 111
            }
            mockUsersCollection.findOne.withArgs({
                username: "test"
            }).resolves(null);

            try {
                await user_service.updateUserPW(mockDb, "test", "12345", "123");
            } catch (e) {
                assert.strictEqual(e.statusCode, 404);
            }
        });
    })
    describe('deleteUser method', function () {
        it('should work', async function () {
            let user = {
                displayname: "test",
                username: "test",
                password: await bcrypt.hash("12345", 10),
                group: 5,
                employeeId: 111
            }
            mockUsersCollection.findOne.withArgs({
                username: "test"
            }).resolves(user);

            mockUsersCollection.deleteOne.withArgs({
                username: "test"
            }).resolves();

            await user_service.deleteUser(mockDb, "test");
        });
        it('should throw error caused by missing param', async function () {
            try {
                await user_service.deleteUser(mockDb);
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        it('should throw error caused by no such user', async function () {
            mockUsersCollection.findOne.withArgs({
                username: "test"
            }).resolves(null);

            try {
                await user_service.deleteUser(mockDb, "test");
            } catch (e) {
                assert.strictEqual(e.statusCode, 404);
            }
        });
    })
    describe('verifyUser method', function () {
        it('should work', async function () {
            let user = {
                displayname: "test",
                username: "test",
                password: await bcrypt.hash("12345", 10),
                group: 5,
                employeeId: 111
            }
            mockUsersCollection.findOne.withArgs({
                username: "test"
            }).resolves(user);

            await user_service.verifyUser(mockDb, "test", "12345");
        });
        it('should throw error caused by missing param', async function () {
            try {
                await user_service.verifyUser(mockDb);
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        it('should throw error caused by wrong password', async function () {
            let user = {
                displayname: "test",
                username: "test",
                password: await bcrypt.hash("12345", 10),
                group: 5,
                employeeId: 111
            }
            mockUsersCollection.findOne.withArgs({
                username: "test"
            }).resolves(user);

            try {
                await user_service.verifyUser(mockDb, "test", "1234");
            } catch (e) {
                assert.strictEqual(e.statusCode, 401);
            }
        });
        it('should throw error caused by no such user', async function () {
            mockUsersCollection.findOne.withArgs({
                username: "test"
            }).resolves(null);

            try {
                await user_service.verifyUser(mockDb, "test", "12345");
            } catch (e) {
                assert.strictEqual(e.statusCode, 404);
            }
        });
    })
})

describe('EvaluationRecordService tests', function () {
    describe('createEvaluationRecord method', function () {
        it('should work', async function () {
            let erecord = new record("2020");
            mockRecordsCollection.findOne.withArgs({
                id: 1,
                "EvaluationRecord.year": 2020
            }).resolves(null);
            mockRecordsCollection.insertOne.withArgs({
                id: 1,
                EvaluationRecord: erecord
            }).resolves();

            await record_service.createEvaluationRecord(mockDb, "1", erecord);
        });
        it('should throw error caused by missing param', async function () {
            try {
                await record_service.createEvaluationRecord(mockDb, "1");
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        it('should throw error caused by wrong param', async function () {
            let erecord = new record("2020");
            try {
                await record_service.createEvaluationRecord(mockDb, "a", erecord);
            } catch (e) {
                assert.strictEqual(e.statusCode, 510);
            }
        });
        it('should throw error caused by duplicate record', async function () {
            let erecord = new record("2020");
            mockRecordsCollection.findOne.withArgs({
                id: 1,
                "EvaluationRecord.year": 2020
            }).resolves(erecord);
            mockRecordsCollection.insertOne.withArgs({
                id: 1,
                EvaluationRecord: erecord
            }).resolves();

            try {
                await record_service.createEvaluationRecord(mockDb, "1", erecord);
            } catch (e) {
                assert.strictEqual(e.statusCode, 409);
            }
        });
    })
    describe('readOneEvaluationRecord method', function () {
        it('should work', async function () {
            mockRecordsCollection.findOne.withArgs({
                id: 1,
                "EvaluationRecord.year": 2020
            }).resolves({
                id: 1,
                EvaluationRecord: {
                    year: 2020
                }
            });

            let result = await record_service.readOneEvaluationRecord(mockDb, "1", "2020");

            assert.strictEqual(result.year, 2020);
        });
        it('should throw error caused by missing param', async function () {
            try {
                await record_service.readOneEvaluationRecord(mockDb, "1");
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        it('should throw error caused by wrong param', async function () {
            try {
                await record_service.readOneEvaluationRecord(mockDb, "a", "2020");
            } catch (e) {
                assert.strictEqual(e.statusCode, 510);
            }
        });
        it('should throw error caused by no such record', async function () {
            let erecord = new record("2020");
            mockRecordsCollection.findOne.withArgs({
                id: 1,
                "EvaluationRecord.year": 2020
            }).resolves(null);

            try {
                await record_service.readOneEvaluationRecord(mockDb, "1", "2020");
            } catch (e) {
                assert.strictEqual(e.statusCode, 404);
            }
        });
    })
    describe('readAllEvaluationRecords method', function () {
        it('should work', async function () {
            let erecord = new record("2020");
            mockRecordsCollection.find.withArgs({
                id: 1
            }).returns(sinon.mongo.documentArray([{
                id: 1,
                EvaluationRecord: erecord
            }]));

            let result = await record_service.readAllEvaluationRecords(mockDb, "1");

            assert.strictEqual(result[0].year, "2020");
        });
        it('should throw error caused by missing param', async function () {
            try {
                await record_service.readAllEvaluationRecords(mockDb);
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        it('should throw error caused by wrong param', async function () {
            try {
                await record_service.readAllEvaluationRecords(mockDb, "a");
            } catch (e) {
                assert.strictEqual(e.statusCode, 510);
            }
        });
        it('should work (return empty array)', async function () {
            mockRecordsCollection.find.withArgs({
                id: 1
            }).returns(sinon.mongo.documentArray([]));

            let result = await record_service.readAllEvaluationRecords(mockDb, "1");

            assert.strictEqual(result[0], undefined);
        });
    })
    describe('deleteEvaluationRecord method', function () {
        it('should work', async function () {
            mockRecordsCollection.findOne.withArgs({
                id: 1,
                "EvaluationRecord.year": 2020
            }).resolves("something");
            mockRecordsCollection.deleteOne.withArgs({
                id: 1,
                "EvaluationRecord.year": 2020
            }).resolves();

            await record_service.deleteEvaluationRecord(mockDb, "1", "2020");
        });
        it('should throw error caused by missing param', async function () {
            try {
                await record_service.deleteEvaluationRecord(mockDb, "1");
            } catch (e) {
                assert.strictEqual(e.statusCode, 400);
            }
        });
        it('should throw error caused by wrong param', async function () {
            try {
                await record_service.deleteEvaluationRecord(mockDb, "a", "2020");
            } catch (e) {
                assert.strictEqual(e.statusCode, 510);
            }
        });
        it('should throw error caused by no such record', async function () {
            mockRecordsCollection.findOne.withArgs({
                id: 1,
                "EvaluationRecord.year": 2020
            }).resolves(null);

            try {
                await record_service.deleteEvaluationRecord(mockDb, "1", "2020");
            } catch (e) {
                assert.strictEqual(e.statusCode, 404);
            }
        });
    })
})
