//express
const express = require('express');
const app = express();


//support for different bodies
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
app.use(bodyParser.json()); //adds support for json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); //adds support url encoded bodies
app.use(upload.array()); //adds support multipart/form-data bodies


//session configuration
const session = require('express-session');
const crypto = require('crypto');
app.use(session({
   secret: crypto.randomBytes(32).toString('hex'),
   resave: false,
   saveUninitialized: false,
   cookie: {
      secure: false
   }
}));


//swagger-api
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('swagger.yml');
app.use('/swagger-api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


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

const OpenCRXConnector = require('./src/connectors/OpenCRX');
const oCRX = new OpenCRXConnector(
    config["OpenCRX_URL"],
    config["OpenCRX_username"],
    config["OpenCRX_password"]);
app.set('oCRX', oCRX);


//starting database-connection and local API
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let auth = "";
if (config["MongoDB_username"] !== ""){
   auth = config["MongoDB_username"] + ":" + config["MongoDB_username"] + "@";
}
MongoClient.connect("mongodb://"+ auth + config["MongoDB_domain"] + ":" + config["MongoDB_port"] + "/", function(err, database) {
   if(err) {
      throw err;
   }

   app.set('db', database.db(config["MongoDB_database"]));

   app.listen(config["API_port"], () => {
      console.log('Server started.');
   });
});


/*------------------------------------------Routes------------------------------------------------*/
//loading local apis
const Authentication = require('./src/api/Authentication');
const User = require('./src/api/User');
const Salesman = require('./src/api/Salesman');
const EvaluationRecord = require('./src/api/EvaluationRecord');
const EvaluationRecordEntry = require('./src/api/EvaluationRecordEntry');

// auth
app.post('/auth', Authentication.authenticate);
app.delete('/auth', Authentication.deAuthenticate);

// Users
app.post('/user', User.add);
app.get('/user', User.list);
app.get('/user/:username', User.get);
app.put('/user', User.update);
app.delete('/user/:username', User.remove);

// Salesman
app.post('/salesman',Salesman.addBonus);
app.get('/salesman', Salesman.list);
app.get('/salesman/:id', Salesman.find);

// EvaluationRecord
app.post('/salesman/:id/evaluationrecord', EvaluationRecord.create);
app.get('/salesman/:id/evaluationrecord', EvaluationRecord.list);
app.get('/salesman/:id/evaluationrecord/:year', EvaluationRecord.find);
app.delete('/salesman/:id/evaluationrecord/:year', EvaluationRecord.remove);

// EvaluationRecordEntry
app.post('/salesman/:id/evaluationrecord/:year/entry', EvaluationRecordEntry.create);
app.get('/salesman/:id/evaluationrecord/:year/entry', EvaluationRecordEntry.list);
app.get('/salesman/:id/evaluationrecord/:year/entry/:name', EvaluationRecordEntry.find);
app.put('/salesman/:id/evaluationrecord/:year/entry', EvaluationRecordEntry.update);
app.delete('/salesman/:id/evaluationrecord/:year/entry/:name', EvaluationRecordEntry.remove);

