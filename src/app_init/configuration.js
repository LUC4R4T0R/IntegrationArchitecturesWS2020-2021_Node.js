const configPath = './config.json';

const fs = require('fs');

function loadConfig(){
    //load config data
    const rawConfig = fs.readFileSync(configPath);
    const config = JSON.parse(rawConfig);

    return config;
}

exports.loadConfig = loadConfig;
