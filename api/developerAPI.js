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

const bcrypt = require('bcrypt');
let validateInputs = require('../auth/validateInputs');
let Developer = require('../model/developer');
let getTimeStamp = require('./getTimeStamp');
var jwt = require('jsonwebtoken');


const post = (req, res) => {
    const validationResult = validateInputs(req);
    if (!validationResult.pass) {
        res.status(500).send({
            error: validationResult.message,
        });
    } else {
        //first check if develop exists if so return an error
        var timeStampISO = getTimeStamp();
        Developer.findOne({
                email: req.body.email.toLowerCase(),
            },
            function (err, developerInDatabase) {
                if (err) {
                    res.status(500).send({
                        error: 'Could not create developer, ' + err.message,
                    });
                } else {
                    if (developerInDatabase !== null) {
                        res.status(500).send({
                            error: 'Could not create developer, already exists.',
                        });
                    } else {
                        //developer doesn't exist so create a new one
                        bcrypt.hash(req.body.password, 10, function (err, hash) {
                            if (err) {
                                res.status(500).send({
                                    error: 'Could not create developer, ' + err.message,
                                });
                            } else {
                                var newDeveloper = new Developer();
                                newDeveloper.email = req.body.email.toLowerCase();
                                newDeveloper.password = hash;
                                newDeveloper.firstName = req.body.firstName;
                                newDeveloper.lastName = req.body.lastName;
                                newDeveloper.bio = req.body.bio;
                                newDeveloper.role = req.body.role;
                                newDeveloper.timeStampISO = timeStampISO;
                                newDeveloper.save(function (err, savedDeveloper) {
                                    if (err) {
                                        res.status(500).send({
                                            error: 'Could not create developer, ' + err.message,
                                        });
                                    } else {
                                        savedDeveloper.password = '';
                                        res.status(200).send(savedDeveloper);
                                    }
                                });
                            }
                        });
                    }
                }
            }
        );
    }
}

const get = (req, res) => {
    Developer.findOne({
            email: req.body.email,
        },
        function (err, developer) {
            if (err) {
                res.status(500).send({
                    error: 'Could not get developer, ' + err.message,
                });
            } else {
                if (developer === null) {
                    res.status(500).send({
                        error: 'Could not get developer, not found',
                    });
                } else {
                    bcrypt.compare(req.body.password, developer.password, function (
                        err,
                        resBcrypt
                    ) {
                        if (err) {
                            res.status(500).send({
                                error: 'Could not get developer' + err.message,
                            });
                        } else {
                            if (resBcrypt) {
                                const payload = {
                                    user: {
                                        id: developer._id,
                                    }
                                }
                                jwt.sign(payload, process.env.JWT_SECRET, {
                                    expiresIn: 86400
                                }, (err, token) => {
                                    if (err) {
                                        res.status(500).send({
                                            error: 'token error' + err.message,
                                        });
                                    } else {
                                        developer.password = '';
                                        res.status(200).send({
                                            token,
                                            developer
                                        });
                                    }
                                });
                            } else {
                                res.status(500).send({
                                    error: 'Could not get developer',
                                });
                            }
                        }
                    });
                }
            }
        }
    );
}

const del = (req, res) => {
    Developer.findOneAndDelete({
            _id: req.body.developerId,
        },
        function (err, developer) {
            if (err) {
                res.status(500).send({
                    error: 'Could not delete developer, ' + err.message,
                });
            } else {
                if (developer === null) {
                    res.status(500).send({
                        error: 'Could not delete developer, not found',
                    });
                } else {
                    res.status(200).send({
                        result: 'Success',
                    });
                }
            }
        }
    );
}

const put = (req, res) => {
    const validationResult = validateInputs(req);
    if (!validationResult.pass) {
        res.status(500).send({
            error: validationResult.message,
        });
    } else {
        var timeStampISO = getTimeStamp();
        Developer.findOne({
                _id: req.body.developerId,
            },
            function (err, developer) {
                if (err) {
                    res.status(500).send({
                        error: 'Could not update developer, ' + err.message,
                    });
                } else {
                    if (developer === null) {
                        res.status(500).send({
                            error: 'Could not update developer, developer not found',
                        });
                    } else {
                        if (err) {
                            res.status(500).send({
                                error: 'Could not update developer, ' + err.message,
                            });
                        } else {
                            if (err) {
                                res.status(500).send({
                                    error: 'Could not update developer' + err.message,
                                });
                            } else {
                                if (err) {
                                    res.status(500).send({
                                        error: 'Could not update developer, ' + err.message,
                                    });
                                } else {
                                    developer.firstName = req.body.firstName;
                                    developer.lastName = req.body.lastName;
                                    developer.email = req.body.email;
                                    developer.bio = req.body.bio;
                                    developer.role = req.body.role;
                                    developer.timeStampISO = timeStampISO;
                                    developer.save(function (err, savedDeveloper) {
                                        if (err) {
                                            res.status(500).send({
                                                error: 'Could not update developer, ' + err.message,
                                            });
                                        } else {
                                            savedDeveloper.password = '';
                                            res.status(200).send(savedDeveloper);
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            }
        );
    }
}

const changePassword = (req, res) => {
    const validationResult = validateInputs(req);
    if (!validationResult.pass) {
        res.status(500).send({
            error: validationResult.message,
        });
    } else {
        var timeStampISO = getTimeStamp();
        Developer.findOne({
                _id: req.body.developerId,
            },
            function (err, developer) {
                if (err) {
                    res.status(500).send({
                        error: 'Could not update developer, ' + err.message,
                    });
                } else {
                    if (developer === null) {
                        res.status(500).send({
                            error: 'Could not update developer, developer not found',
                        });
                    } else {
                        if (err) {
                            res.status(500).send({
                                error: 'Could not update developer, ' + err.message,
                            });
                        } else {
                            bcrypt.compare(req.body.oldPassword, developer.password, function (
                                err,
                                resBcrypt
                            ) {
                                if (err) {
                                    res.status(500).send({
                                        error: 'Could not update developer' + err.message,
                                    });
                                } else {
                                    if (resBcrypt) {
                                        bcrypt.hash(req.body.password, 10, function (err, hash) {
                                            if (err) {
                                                res.status(500).send({
                                                    error: 'Could not update developer, ' + err.message,
                                                });
                                            } else {
                                                developer.password = hash;
                                                developer.timeStampISO = timeStampISO;
                                                developer.save(function (err, savedDeveloper) {
                                                    if (err) {
                                                        res.status(500).send({
                                                            error: 'Could not update developer, ' + err.message,
                                                        });
                                                    } else {
                                                        savedDeveloper.password = '';
                                                        res.status(200).send(savedDeveloper);
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        res.status(500).send({
                                            error: 'Could not update developer password incorrect',
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            }
        );
    }
};

module.exports = {
    post: post,
    get: get,
    delete: del,
    put: put,
    changePassword: changePassword,
};