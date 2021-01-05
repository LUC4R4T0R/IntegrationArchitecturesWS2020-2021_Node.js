//express
const express = require('express');
const app = express();

//base route
const apiRouter = express.Router();

const expressControl = require('./src/app_init/express');
const expressState = expressControl.initExpress(apiRouter);

//load config data
const fs = require('fs');
const rawConfig = fs.readFileSync('./config.json');
const config = JSON.parse(rawConfig);


//load and start API-connectors
const OrangeHRMConnector = require('./src/connectors/OrangeHRM');
const oHRM = new OrangeHRMConnector(
    config["OrangeHRM_URL"],
    config["OrangeHRM_username"],
    config["OrangeHRM_password"],
    2);
app.set('oHRM', oHRM);

const remoteConnectors = require('./src/app_init/remoteConnectors');
const remoteState = remoteConnectors.initRemoteConnectors(app,config);

//initialize database connection
const mongoDB = require('./src/app_init/mongoDB');
const dbState = mongoDB.connectMongoDB(app,config)
    .then(_=> expressControl.startServer(app, config));

//load routing from app_init
const routing = require('./src/app_init/routing');
const routingState = routing.applyRouting(app, apiRouter);

