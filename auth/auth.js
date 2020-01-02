// ==================================================================
// SETUP
//
// A .env document is needed with the following parameters
// NODE_ENVIRONMENT=production or development
// PORT=****
// MONGO_USER=****
// MONGO_PASSWORD=****
// JWT_SECRET=****
// ==================================================================
require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) { //next move on to the next piece of middleware
    const token = req.header('x-auth-token');
    if (!token) {
        res.status(401).send({
            error: 'no token, authorization denied',
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).send({
            error: 'Token is not valid',
        });
    }
}