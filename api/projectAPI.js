const mongoose = require('mongoose');
let Developer = require('../model/developer');
let Project = require('../model/project');
let getTimeStamp = require('./getTimeStamp');
const auth = require("../auth/auth");

const post = (req, res) => {
    var timeStampISO = getTimeStamp();
    Developer.findOne({
            _id: req.body.developerId,
        },
        function (err, developer) {
            if (err) {
                res.status(500).send({
                    error: 'Could not create project, ' + err.message,
                });
            } else {
                if (developer === null) {
                    res.status(500).send({
                        error: 'Could not create project, developer not found',
                    });
                } else {
                    var project = new Project();
                    var developer = {};
                    project.name = req.body.name;
                    project.description = req.body.description;
                    project.developers.push({
                        developerId: developer._id,
                        canRead: true,
                        canWrite: true,
                        firstName: developer.firstName,
                        lastName: developer.lastName,
                        email: developer.email,
                    });
                    project.timeStampISO = timeStampISO;
                    project.save(function (err, savedProject) {
                        if (err) {
                            res.status(500).send({
                                error: 'Could not create project, ' + err.message,
                            });
                        } else {
                            developer.projectIds.push(savedProject._id);
                            developer.timeStampISO = timeStampISO;
                            developer.save(function (err, savedDeveloper) {
                                if (err) {
                                    res.status(500).send({
                                        error: 'Could not save developer, ' + err.message,
                                    });
                                } else {
                                    res.status(200).send(savedProject);
                                }
                            });
                        }
                    });
                }
            }
        }
    );
};

const get = (req, res) => {
    Project.findOne({
            _id: req.body.projectId,
        },
        function (err, project) {
            if (err) {
                res.status(500).send({
                    error: 'Could not get project, ' + err.message,
                });
            } else {
                if (project === null) {
                    res.status(500).send({
                        error: 'Could not get project, not found',
                    });
                } else {
                    res.status(200).send(project);
                }
            }
        }
    );
};

const postReturnProjectDeveloper = (req, res) => {
    var timeStampISO = getTimeStamp();
    Developer.findOne({
            _id: req.body.developerId,
        },
        function (err, developer) {
            if (err) {
                res.status(500).send({
                    error: 'Could not create project, ' + err.message,
                });
            } else {
                if (developer === null) {
                    res.status(500).send({
                        error: 'Could not create project, developer not found',
                    });
                } else {
                    var project = new Project();
                    project.name = req.body.name;
                    project.description = req.body.description;
                    project.developers.push({
                        developerId: developer._id,
                        canRead: true,
                        canWrite: true,
                        canAdmin: true,
                        firstName: developer.firstName,
                        lastName: developer.lastName,
                        email: developer.email,
                    });
                    project.timeStampISO = timeStampISO;
                    project.save(function (err, savedProject) {
                        if (err) {
                            res.status(500).send({
                                error: 'Could not create project, ' + err.message,
                            });
                        } else {
                            developer.projectIds.push(savedProject._id);
                            developer.timeStampISO = timeStampISO;
                            developer.save(function (err, savedDeveloper) {
                                if (err) {
                                    res.status(500).send({
                                        error: 'Could not save developer, ' + err.message,
                                    });
                                } else {
                                    savedDeveloper.password = '';
                                    res.status(200).send({
                                        project: savedProject,
                                        developer: savedDeveloper,
                                    });
                                }
                            });
                        }
                    });
                }
            }
        }
    );
};

// const del = (req, res) => {
//     var timeStampISO = getTimeStamp();
//     Project.findOneAndDelete({
//             _id: req.body.projectId,
//         },
//         function (err, project) {
//             if (err) {
//                 res.status(500).send({
//                     error: 'Could not delete project, ' + err.message,
//                 });
//             } else {
//                 if (project === null) {
//                     res.status(500).send({
//                         error: 'Could not delete project, not found',
//                     });
//                 } else {
//                     Developer.findByIdAndUpdate(
//                         req.body.developerId, {
//                             $pull: {
//                                 projectIds: mongoose.Types.ObjectId(req.body.projectId),
//                             },
//                             $set: {
//                                 timeStampISO: timeStampISO,
//                             },
//                         }, {
//                             new: true,
//                             safe: true,
//                             upsert: true,
//                         },
//                         function (err, SavedDeveloper) {
//                             if (err) {
//                                 res.status(500).send({
//                                     error: 'Could not remove project from developer',
//                                 });
//                             } else {
//                                 res.status(200).send(SavedDeveloper);
//                             }
//                         }
//                     );
//                 }
//             }
//         }
//     );
// };

const del = async (req, res) => {
    var timeStampISO = getTimeStamp();
    try {
        const project = await Project.findOneAndDelete({
            _id: req.body.project._id,
        });
        if (project === null) {
            res.status(500).send({
                error: 'Could not delete project, not found',
            });
        } else {
            try {
                let mySaveDevelopers = [];
                for (let i = 0; i < req.body.project.developers.length; i++) {
                    const savedDeveloper = await Developer.findByIdAndUpdate(
                        req.body.project.developers[i].developerId, {
                            $pull: {
                                projectIds: mongoose.Types.ObjectId(req.body.project._id),
                            },
                            $set: {
                                timeStampISO: timeStampISO,
                            },
                        }, {
                            new: true,
                            safe: true,
                            upsert: true,
                        }, );
                    mySaveDevelopers.push(savedDeveloper)
                }
                res.status(200).send(mySaveDevelopers);
            } catch (error) {
                res.status(500).send({
                    error: 'Could not remove project from developer, ' + error.message,
                });
            }
        }
    } catch (error) {
        res.status(500).send({
            error: 'Could not delete project, ' + error.message,
        });
    }
};

const getProjects = (req, res) => {
    Project.find({
            _id: {
                $in: req.body.projectIds,
            },
        },
        function (err, projects) {
            if (err) {
                res.status(500).send({
                    error: 'Could not get projects, ' + err.message,
                });
            } else {
                if (projects === null) {
                    res.status(500).send({
                        error: 'Could not get projects, not found',
                    });
                } else {
                    res.status(200).send(projects);
                }
            }
        }
    );
};

const put = (req, res) => {
    var timeStampISO = getTimeStamp();
    Project.findOne({
            _id: req.body.projectId,
        },
        function (err, project) {
            if (err) {
                res.status(500).send({
                    error: 'Could not update project, ' + err.message,
                });
            } else {
                if (project === null) {
                    res.status(500).send({
                        error: 'Could not update project, project not found',
                    });
                } else {
                    if (err) {
                        res.status(500).send({
                            error: 'Could not update project, ' + err.message,
                        });
                    } else {
                        project.name = req.body.name;
                        project.description = req.body.description;
                        project.timeStampISO = timeStampISO;
                        project.save(function (err, savedProject) {
                            if (err) {
                                res.status(500).send({
                                    error: 'Could not save project, ' + err.message,
                                });
                            } else {
                                res.status(200).send(savedProject);
                            }
                        });
                    }
                }
            }
        }
    );
};

const putReturnProjectDeveloper = (req, res) => {
    var timeStampISO = getTimeStamp();
    Project.findOne({
            _id: req.body.projectId,
        },
        function (err, project) {
            if (err) {
                res.status(500).send({
                    error: 'Could not update project, ' + err.message,
                });
            } else {
                if (project === null) {
                    res.status(500).send({
                        error: 'Could not update project, project not found',
                    });
                } else {
                    if (err) {
                        res.status(500).send({
                            error: 'Could not update project, ' + err.message,
                        });
                    } else {
                        project.name = req.body.name;
                        project.description = req.body.description;
                        project.developers = req.body.developers;
                        project.timeStampISO = timeStampISO;
                        project.save(function (err, savedProject) {
                            if (err) {
                                res.status(500).send({
                                    error: 'Could not save project, ' + err.message,
                                });
                            } else {
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
                                                    developer.timeStampISO = timeStampISO;
                                                    developer.save(function (err, savedDeveloper) {
                                                        if (err) {
                                                            res.status(500).send({
                                                                error: 'Could not save developer, ' + err.message,
                                                            });
                                                        } else {
                                                            savedDeveloper.password = '';
                                                            res.status(200).send({
                                                                project: savedProject,
                                                                developer: savedDeveloper,
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                );
                            }
                        });
                    }
                }
            }
        }
    );
};

module.exports = {
    post: post,
    postReturnObjects: postReturnProjectDeveloper,
    delete: del,
    get: get,
    getProjects: getProjects,
    put: put,
    putReturnProjectDeveloper: putReturnProjectDeveloper,
};