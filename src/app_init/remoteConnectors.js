async function initRemoteConnectors(app, config){
    await Promise.all([
        initOpenCRX(app, config),
        initOrangeHRM(app, config)
    ]);
}

async function initOrangeHRM(app, config){
    const OrangeHRMConnector = require('../connectors/OrangeHRM');
    const oHRM = new OrangeHRMConnector(
        config["OrangeHRM_URL"],
        config["OrangeHRM_username"],
        config["OrangeHRM_password"],
        2);
    app.set('oHRM', oHRM);
}

async function initOpenCRX(app, config){
    const OpenCRXConnector = require('../connectors/OpenCRX');
    const oCRX = new OpenCRXConnector(
        config["OpenCRX_URL"],
        config["OpenCRX_username"],
        config["OpenCRX_password"]);
    app.set('oCRX', oCRX);
}

exports.initRemoteConnectors = initRemoteConnectors;
