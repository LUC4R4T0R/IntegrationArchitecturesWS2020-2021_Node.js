const express = require('express'); //load the express module
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); //adds support for json encoded bodies
const fs = require('fs');

const rawConfig = fs.readFileSync('./config.json');
const config = JSON.parse(rawConfig);

const OrangeHRMConnector = require('./connectors/OrangeHRM');
const oHRM = new OrangeHRMConnector(config["OrangeHRM_URL"], config["OrangeHRM_username"], config["OrangeHRM_password"]);
const OpenCRXConnector = require('./connectors/OpenCRX');
const oCRX = new OpenCRXConnector(config["OpenCRX_URL"], config["OpenCRX_username"], config["OpenCRX_password"]);

app.listen(config["API_port"], () => {
   console.log('Server started.');
});

app.get('/test', (req,res) => {
   oHRM.addBonusSalary(8, 2021, 1000000);
});

app.get('/testUser', (req, res) => {
   (async function(){
      res.send(await oCRX.getUserByGovernmentId(91337));
   })();
});

app.get('/testSalesOrder', (req, res) => {
   (async function(){
      res.send(await oCRX.getSalesOrderByAccountId('xri://@openmdx*org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/9ENFSDRCBESBTH2MA4T2TYJFL'));
   })();
});

app.get('/testContract', (req, res) => {
   (async function(){
      res.send(await oCRX.getContractPositions('9ENGNFGDLDQSPH2MA4T2TYJFL'));
   })();
});

app.get('/testRating', (req, res) => {
   (async function(){
      res.send(await oCRX.getRating('9ENGNFGDLDQSPH2MA4T2TYJFL'));
   })();
});