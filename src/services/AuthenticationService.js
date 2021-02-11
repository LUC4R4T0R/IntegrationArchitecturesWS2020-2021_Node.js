let NotAuthenticatedError = require('../custom_errors/NotAuthenticatedError');

/**
 * This method checks if someone is authenticated.
 *
 * @param session the session of the user
 * @returns {Promise<void>} This methods returns nothing.
 */
exports.authenticated = async function (session) {
    if (session !== undefined && session.loggedIn) {
        return;
    }
    throw new NotAuthenticatedError();
}

/**
 * This method authenticates an user.
 *
 * @param session the session of the user
 * @param username the username
 */
exports.authenticate = function (session , username) {
    session.user = username;
    session.loggedIn = true;
}

/**
 * This method deAuthenticates an user.
 *
 * @param session the session of the user
 */
exports.deAuthenticate = function (session) {
    session.loggedIn = false;
    session.destroy();
}
