const configPath = './config.json';

const fs = require('fs');

function loadConfig(){
    //load config data
    const rawConfig = fs.readFileSync(configPath);
    return JSON.parse(rawConfig.toString());
}

exports.loadConfig = loadConfig;
