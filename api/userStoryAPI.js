const mongoose = require('mongoose');
let Developer = require('../model/developer');
let Project = require('../model/project');
var UserStory = require('../model/user-story');
var Bug = require('../model/bug');
let getTimeStamp = require('./getTimeStamp');

const post = (req, res) => {
    var timeStampISO = getTimeStamp();
    Project.findOne({
            _id: req.body.projectId,
        },
        function (err, project) {
            if (err) {
                res.status(500).send({
                    error: 'Could not create user story, ' + err.message,
                });
            } else {
                if (project === null) {
                    res.status(500).send({
                        error: 'Could not create user story, Project not found',
                    });
                } else {
                    var userStory = new UserStory();
                    userStory.userStoryTitle = req.body.userStoryTitle;
                    userStory.userRole = req.body.userRole;
                    userStory.userWant = req.body.userWant;
                    userStory.userBenefit = req.body.userBenefit;
                    userStory.acceptanceCriteria = req.body.acceptanceCriteria;
                    userStory.conversation = req.body.conversation;
                    userStory.estimate = req.body.estimate;
                    userStory.phase = req.body.phase;
                    userStory.percentDone = req.body.percentDone;
                    userStory.priority = req.body.priority;
                    userStory.sprint = req.body.sprint;
                    userStory.projectId = req.body.projectId;
                    userStory.timeStampISO = timeStampISO;
                    userStory.save(function (err, savedUserStory) {
                        if (err) {
                            res.status(500).send({
                                error: 'Could not create user story, ' + err.message,
                            });
                        } else {
                            project.userStoryIds.push(savedUserStory._id);
                            project.timeStampISO = timeStampISO;
                            project.save(function (err, savedProject) {
                                if (err) {
                                    res.status(500).send({
                                        error: 'Could not save project, ' + err.message,
                                    });
                                } else {
                                    res.status(200).send(savedUserStory);
                                }
                            });
                        }
                    });
                }
            }
        }
    );
};

const postReturnUserStoryProject = (req, res) => {
    var timeStampISO = getTimeStamp();
    Project.findOne({
            _id: req.body.projectId,
        },
        function (err, project) {
            if (err) {
                res.status(500).send({
                    error: 'Could not create user story, ' + err.message,
                });
            } else {
                if (project === null) {
                    res.status(500).send({
                        error: 'Could not create user story, Project not found',
                    });
                } else {
                    var userStory = new UserStory();
                    userStory.userStoryTitle = req.body.userStoryTitle;
                    userStory.userRole = req.body.userRole;
                    userStory.userWant = req.body.userWant;
                    userStory.userBenefit = req.body.userBenefit;
                    userStory.acceptanceCriteria = req.body.acceptanceCriteria;
                    userStory.conversation = req.body.conversation;
                    userStory.estimate = req.body.estimate;
                    userStory.phase = req.body.phase;
                    userStory.percentDone = req.body.percentDone;
                    userStory.priority = req.body.priority;
                    userStory.sprint = req.body.sprint;
                    userStory.projectId = req.body.projectId;
                    userStory.timeStampISO = timeStampISO;
                    userStory.save(function (err, savedUserStory) {
                        if (err) {
                            res.status(500).send({
                                error: 'Could not create user story, ' + err.message,
                            });
                        } else {
                            project.userStoryIds.push(savedUserStory._id);
                            project.timeStampISO = timeStampISO;
                            project.save(function (err, savedProject) {
                                if (err) {
                                    res.status(500).send({
                                        error: 'Could not save project, ' + err.message,
                                    });
                                } else {
                                    res.status(200).send({
                                        userStory: savedUserStory,
                                        project: savedProject,
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

const get = (req, res) => {
    UserStory.findOne({
            _id: req.body.userStoryId,
        },
        function (err, userStory) {
            if (err) {
                res.status(500).send({
                    error: 'Could not get user story, ' + err.message,
                });
            } else {
                if (userStory === null) {
                    res.status(500).send({
                        error: 'Could not get user story, not found',
                    });
                } else {
                    res.status(200).send(userStory);
                }
            }
        }
    );
};

const getUserStorys = (req, res) => {
    UserStory.find({
            _id: {
                $in: req.body.userStoryIds,
            },
        },
        function (err, userStories) {
            if (err) {
                res.status(500).send({
                    error: 'Could not get user stories, ' + err.message,
                });
            } else {
                if (userStories === null) {
                    res.status(500).send({
                        error: 'Could not get stories, not found',
                    });
                } else {
                    res.status(200).send(userStories);
                }
            }
        }
    );
};

const del = (req, res) => {
    var timeStampISO = getTimeStamp();
    UserStory.findOneAndDelete({
            _id: req.body.userStoryId,
        },
        function (err, userStory) {
            if (err) {
                res.status(500).send({
                    error: 'Could not delete user story, ' + err.message,
                });
            } else {
                if (userStory === null) {
                    res.status(500).send({
                        error: 'Could not delete user story, not found',
                    });
                } else {
                    Project.findByIdAndUpdate(
                        req.body.projectId, {
                            $pull: {
                                userStoryIds: mongoose.Types.ObjectId(req.body.userStoryId),
                            },
                            $set: {
                                timeStampISO: timeStampISO,
                            },
                        }, {
                            new: true,
                            safe: true,
                            upsert: true,
                        },
                        function (err, SavedProject) {
                            if (err) {
                                res.status(500).send({
                                    error: 'Could not remove user story from project',
                                });
                            } else {
                                res.status(200).send(SavedProject);
                            }
                        }
                    );
                }
            }
        }
    );
};

const deleteUserStorys = (req, res) => {
    var timeStampISO = getTimeStamp();
    UserStory.deleteMany({
            _id: {
                $in: req.body.userStoryIds,
            },
        },
        function (err, userStories) {
            if (err) {
                res.status(500).send({
                    error: 'Could not get user stories, ' + err.message,
                });
            } else {
                if (userStories === null) {
                    res.status(500).send({
                        error: 'Could not delete stories, not found',
                    });
                } else {
                    res.status(200).send({
                        result: 'Success',
                    });
                }
            }
        }
    );
};

const put = (req, res) => {
    var timeStampISO = getTimeStamp();
    UserStory.findOne({
            _id: req.body.userStoryId,
        },
        function (err, userStory) {
            if (err) {
                res.status(500).send({
                    error: 'Could not update user story, ' + err.message,
                });
            } else {
                if (userStory === null) {
                    res.status(500).send({
                        error: 'Could not update user story, user story not found',
                    });
                } else {
                    if (err) {
                        res.status(500).send({
                            error: 'Could not update user story, ' + err.message,
                        });
                    } else {
                        userStory.userStoryTitle = req.body.userStoryTitle;
                        userStory.userRole = req.body.userRole;
                        userStory.userWant = req.body.userWant;
                        userStory.userBenefit = req.body.userBenefit;
                        userStory.acceptanceCriteria = req.body.acceptanceCriteria;
                        userStory.conversation = req.body.conversation;
                        userStory.estimate = req.body.estimate;
                        userStory.phase = req.body.phase;
                        userStory.percentDone = req.body.percentDone;
                        userStory.priority = req.body.priority;
                        userStory.sprint = req.body.sprint;
                        userStory.timeStampISO = timeStampISO;
                        userStory.save(function (err, savedUserStory) {
                            if (err) {
                                res.status(500).send({
                                    error: 'Could not save user story, ' + err.message,
                                });
                            } else {
                                res.status(200).send(savedUserStory);
                            }
                        });
                    }
                }
            }
        }
    );
};

const putReturnUserStoryProject = (req, res) => {
    var timeStampISO = getTimeStamp();
    UserStory.findOne({
            _id: req.body.userStoryId,
        },
        function (err, userStory) {
            if (err) {
                res.status(500).send({
                    error: 'Could not update user story, ' + err.message,
                });
            } else {
                if (userStory === null) {
                    res.status(500).send({
                        error: 'Could not update user story, user story not found',
                    });
                } else {
                    if (err) {
                        res.status(500).send({
                            error: 'Could not update user story, ' + err.message,
                        });
                    } else {
                        userStory.userStoryTitle = req.body.userStoryTitle;
                        userStory.userRole = req.body.userRole;
                        userStory.userWant = req.body.userWant;
                        userStory.userBenefit = req.body.userBenefit;
                        userStory.acceptanceCriteria = req.body.acceptanceCriteria;
                        userStory.conversation = req.body.conversation;
                        userStory.estimate = req.body.estimate;
                        userStory.phase = req.body.phase;
                        userStory.percentDone = req.body.percentDone;
                        userStory.priority = req.body.priority;
                        userStory.sprint = req.body.sprint;
                        userStory.timeStampISO = timeStampISO;
                        userStory.save(function (err, savedUserStory) {
                            if (err) {
                                res.status(500).send({
                                    error: 'Could not save user story, ' + err.message,
                                });
                            } else {
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
                                                    project.timeStampISO = timeStampISO;
                                                    project.save(function (err, savedProject) {
                                                        if (err) {
                                                            res.status(500).send({
                                                                error: 'Could not save project, ' + err.message,
                                                            });
                                                        } else {
                                                            res.status(200).send({
                                                                userStory: savedUserStory,
                                                                project: savedProject,
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
    postReturnUserStoryProject: postReturnUserStoryProject,
    get: get,
    getUserStorys: getUserStorys,
    delete: del,
    deleteUserStorys: deleteUserStorys,
    put: put,
    putReturnUserStoryProject: putReturnUserStoryProject,
};