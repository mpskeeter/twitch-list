const users = require('./users');
const generate_uid = require('./generate_uid');

loadRoutes = (app) => {
    app.use('/api/v1/users', users);
    app.use('/api/v1/generate_uid', generate_uid);
}

module.exports = loadRoutes;
