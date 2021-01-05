const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const session = require('express-session');
const crypto = require('crypto');

async function initExpress(apiRouter){
    let sessionState = initSession(apiRouter);
    initBodyParser(apiRouter);
    await sessionState;
}

exports.initExpress = initExpress;

async function startServer(app, config){
    await app.listen(config["API_port"], () => { //start webserver
        console.log('Webserver started.');
    });
}

exports.startServer = startServer;

function initBodyParser(apiRouter){
    //support for different bodie
    apiRouter.use(bodyParser.json()); //adds support for json encoded bodies
    apiRouter.use(bodyParser.urlencoded({extended: true})); //adds support url encoded bodies
    apiRouter.use(upload.array()); //adds support multipart/form-data bodies
}

async function initSession(apiRouter){
    //session configuration
    await apiRouter.use(session({
        secret: crypto.randomBytes(32).toString('hex'),
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false
        }
    }));
}
