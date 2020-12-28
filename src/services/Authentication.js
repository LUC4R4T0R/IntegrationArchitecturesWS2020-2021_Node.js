let NotAuthenticatedError = require('../custom_errors/NotAuthenticatedError');

exports.authenticated = async function(session){
    if(session !== undefined && session.loggedIn){
        return;
    }
    throw new NotAuthenticatedError();
}

exports.authenticate = function(session){
    session.loggedIn = true;
}

exports.deAuthenticate = function(session){
    session.loggedIn = false;
    session.destroy();
}