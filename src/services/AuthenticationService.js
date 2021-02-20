let NotAuthenticatedError = require('../custom_errors/NotAuthenticatedError');

/**
 * This method checks if someone is authenticated.
 *
 * @param session the session of the user
 * @returns {Promise<void>} This methods returns nothing.
 */
exports.authenticated = async function (session, minGroup) {
    if (session !== undefined && session.loggedIn && minGroup <= session.group) {
        return;
    }
    throw new NotAuthenticatedError();
}

/**
 * This method authenticates a user.
 *
 * @param session the session of the user
 * @param username the username
 */
exports.authenticate = function (session , username, group) {
    session.user = username;
    session.loggedIn = true;
    session.group = group;
}

/**
 * This method deAuthenticates a user.
 *
 * @param session the session of the user
 */
exports.deAuthenticate = function (session) {
    session.loggedIn = false;
    session.destroy();
}
