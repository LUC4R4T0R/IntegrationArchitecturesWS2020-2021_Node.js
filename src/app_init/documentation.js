const swaggerConfig = 'swagger.yml';

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

function registerSwagger(apiRouter){
    const swaggerDocument = YAML.load(swaggerConfig);
    apiRouter.use('/swagger-api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

exports.registerSwagger = registerSwagger;
