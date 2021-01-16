const supertest = require('supertest');

//app
//express
const express = require('express');
const app = express();

const apiRouter = express.Router();

const expressControl = require('../../src/app_init/express');
const expressState = expressControl.initExpress(apiRouter);

//load config data
const configuration = require('../../src/app_init/configuration');
const config = configuration.loadConfig();

const documentation = require('../../src/app_init/documentation');
documentation.registerSwagger(apiRouter);

const remoteConnectors = require('../../src/app_init/remoteConnectors');
const remoteState = remoteConnectors.initRemoteConnectors(app,config);

//initialize database connection
const mongoDB = require('../../src/app_init/mongoDB');
const dbState = mongoDB.connectMongoDB(app,config);

//load routing from app_init
const routing = require('../../src/app_init/routing');
const routingState = routing.applyRouting(app, apiRouter);

Promise.all([
    expressState,
    remoteState,
    dbState,
    routingState
])
    .then(_=>{
        console.log('All Subsystems loaded!');
    });



describe('tets', function (){
    it('bla ', function () {
        supertest(app)
            .get('/api/user')
            .end(function(err, res) {
                if (err) throw err;
                console.log(res);
            });
    });
})
