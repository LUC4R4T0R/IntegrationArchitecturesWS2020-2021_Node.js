//express
const express = require('express');
const app = express();

//base route
const apiRouter = express.Router();
app.use('/api', apiRouter);

//support for different bodies
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
apiRouter.use(bodyParser.json()); //adds support for json encoded bodies
apiRouter.use(bodyParser.urlencoded({extended: true})); //adds support url encoded bodies
apiRouter.use(upload.array()); //adds support multipart/form-data bodies


//session configuration
const session = require('express-session');
const crypto = require('crypto');
apiRouter.use(session({
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
apiRouter.use('/swagger-api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


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

//extended routes
const authRouter = express.Router();
apiRouter.use('/auth', authRouter);
const userRouter = express.Router();
apiRouter.use('/user',userRouter);
const salesmanRouter = express.Router();
apiRouter.use('/salesman', salesmanRouter);

// auth
authRouter.post('', Authentication.authenticate);
authRouter.delete('', Authentication.deAuthenticate);
authRouter.get('', Authentication.isAuthenticated);
authRouter.get('/user', Authentication.currentUser);

// Users
userRouter.post('', User.create);
userRouter.get('', User.list);
userRouter.get('/:username', User.find);
userRouter.put('', User.update);
userRouter.delete('/:username', User.remove);

// Salesman
salesmanRouter.post('',Salesman.addBonus);
salesmanRouter.get('', Salesman.list);
salesmanRouter.get('/:id', Salesman.find);

// EvaluationRecord
salesmanRouter.post('/:id/evaluationrecord', EvaluationRecord.create);
salesmanRouter.get('/:id/evaluationrecord', EvaluationRecord.list);
salesmanRouter.get('/:id/evaluationrecord/:year', EvaluationRecord.find);
salesmanRouter.delete('/:id/evaluationrecord/:year', EvaluationRecord.remove);

// EvaluationRecordEntry
salesmanRouter.post('/:id/evaluationrecord/:year/entry', EvaluationRecordEntry.create);
salesmanRouter.get('/:id/evaluationrecord/:year/entry', EvaluationRecordEntry.list);
salesmanRouter.get('/:id/evaluationrecord/:year/entry/:name', EvaluationRecordEntry.find);
salesmanRouter.put('/:id/evaluationrecord/:year/entry', EvaluationRecordEntry.update);
salesmanRouter.delete('/:id/evaluationrecord/:year/entry/:name', EvaluationRecordEntry.remove);

