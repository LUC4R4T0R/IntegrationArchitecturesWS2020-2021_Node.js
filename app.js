const express = require('express'); //load the express module
const app = express();

const OrangeHRMConnector = require('./connectors/OrangeHRM');
const oHRM = new OrangeHRMConnector('https://sepp-hrm.inf.h-brs.de/symfony/web/index.php', 'demouser', '*Safb02da42Demo$');

app.get('/hello/:name', (req, res) => { //specifying a first get-request
   console.log(req.params.name + ' visited the page');
   res.send('Hello my name is ' + req.params.name + '.');
});

app.listen(8081, () => {
   console.log('Server started.');
});

const bodyParser = require('body-parser');
app.use(bodyParser.json()); //adds support for json encoded bodies

var notes = [];

app.post('/notes/add', (req,res) => {
   if(req.body.text !== undefined){
      console.log('new note!');
      notes.push(req.body.text);
      res.send('note saved');
   }else{
      res.status(400).send('no text specified!');
   }
});

app.get('/notes', (req, res) => { //specifying a first get-request
   console.log('notes being read');
   res.send(notes.join('<br><br>'));
});

app.get('/test', (req,res) => {
   oHRM.addBonusSalary(8, 2021, 1000000);
});