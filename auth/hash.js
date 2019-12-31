// ==================================================================
// hashing functions for password
// ==================================================================

const bcrypt = require('bcrypt');

module.exports = function hashPassword(password) {
    bcrypt.hash(password, 10, function (err, hash) {
        if (hash) {
            console.log(hash);
            return hash;
        } else {
            console.log(err);
            return hash;
        }
    });
}