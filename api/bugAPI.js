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
                    error: 'Could not create bug, ' + err.message,
                });
            } else {
                if (project === null) {
                    res.status(500).send({
                        error: 'Could not create bug, Project not found',
                    });
                } else {
                    var bug = new Bug();
                    bug.bugTitle = req.body.bugTitle;
                    bug.summary = req.body.summary;
                    bug.stepsToReproduce = req.body.stepsToReproduce;
                    bug.expectedResults = req.body.expectedResults;
                    bug.actualResults = req.body.actualResults;
                    bug.resolution = req.body.resolution;
                    bug.acceptanceCriteria = req.body.acceptanceCriteria;
                    bug.estimate = req.body.estimate;
                    bug.phase = req.body.phase;
                    bug.percentDone = req.body.percentDone;
                    bug.priority = req.body.priority;
                    bug.sprint = req.body.sprint;
                    bug.projectId = req.body.projectId;
                    bug.timeStampISO = timeStampISO;
                    bug.save(function (err, savedBug) {
                        if (err) {
                            res.status(500).send({
                                error: 'Could not create bug, ' + err.message,
                            });
                        } else {
                            project.bugIds.push(savedBug._id);
                            project.timeStampISO = timeStampISO;
                            project.save(function (err, savedProject) {
                                if (err) {
                                    res.status(500).send({
                                        error: 'Could not save project, ' + err.message,
                                    });
                                } else {
                                    res.status(200).send(savedBug);
                                }
                            });
                        }
                    });
                }
            }
        }
    );
};

const postReturnBugProject = (req, res) => {
    var timeStampISO = getTimeStamp();
    Project.findOne({
            _id: req.body.projectId,
        },
        function (err, project) {
            if (err) {
                res.status(500).send({
                    error: 'Could not create bug, ' + err.message,
                });
            } else {
                if (project === null) {
                    res.status(500).send({
                        error: 'Could not create bug, Project not found',
                    });
                } else {
                    var bug = new Bug();
                    bug.bugTitle = req.body.bugTitle;
                    bug.summary = req.body.summary;
                    bug.stepsToReproduce = req.body.stepsToReproduce;
                    bug.expectedResults = req.body.expectedResults;
                    bug.actualResults = req.body.actualResults;
                    bug.resolution = req.body.resolution;
                    bug.acceptanceCriteria = req.body.acceptanceCriteria;
                    bug.estimate = req.body.estimate;
                    bug.phase = req.body.phase;
                    bug.percentDone = req.body.percentDone;
                    bug.priority = req.body.priority;
                    bug.sprint = req.body.sprint;
                    bug.projectId = req.body.projectId;
                    bug.timeStampISO = timeStampISO;
                    bug.save(function (err, savedBug) {
                        if (err) {
                            res.status(500).send({
                                error: 'Could not create bug, ' + err.message,
                            });
                        } else {
                            project.bugIds.push(savedBug._id);
                            project.timeStampISO = timeStampISO;
                            project.save(function (err, savedProject) {
                                if (err) {
                                    res.status(500).send({
                                        error: 'Could not save project, ' + err.message,
                                    });
                                } else {
                                    res.status(200).send({
                                        bug: savedBug,
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
    Bug.findOne({
            _id: req.body.bugId,
        },
        function (err, bug) {
            if (err) {
                res.status(500).send({
                    error: 'Could not get bug, ' + err.message,
                });
            } else {
                if (bug === null) {
                    res.status(500).send({
                        error: 'Could not get bug, not found',
                    });
                } else {
                    res.status(200).send(bug);
                }
            }
        }
    );
};

const getBugs = (req, res) => {
    Bug.find({
            _id: {
                $in: req.body.bugIds,
            },
        },
        function (err, bugs) {
            if (err) {
                res.status(500).send({
                    error: 'Could not get bugs, ' + err.message,
                });
            } else {
                if (bugs === null) {
                    res.status(500).send({
                        error: 'Could not get bugs, not found',
                    });
                } else {
                    res.status(200).send(bugs);
                }
            }
        }
    );
};

const del = (req, res) => {
    var timeStampISO = getTimeStamp();
    Bug.findOneAndDelete({
            _id: req.body.bugId,
        },
        function (err, bug) {
            if (err) {
                res.status(500).send({
                    error: 'Could not delete bug, ' + err.message,
                });
            } else {
                if (bug === null) {
                    res.status(500).send({
                        error: 'Could not delete bug, not found',
                    });
                } else {
                    Project.findByIdAndUpdate(
                        req.body.projectId, {
                            $pull: {
                                bugIds: mongoose.Types.ObjectId(req.body.bugId),
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
                                    error: 'Could not remove bug from project',
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

const deleteBugs = (req, res) => {
    var timeStampISO = getTimeStamp();
    Bug.deleteMany({
            _id: {
                $in: req.body.bugIds,
            },
        },
        function (err, bugs) {
            if (err) {
                res.status(500).send({
                    error: 'Could not get bugs, ' + err.message,
                });
            } else {
                if (bugs === null) {
                    res.status(500).send({
                        error: 'Could not bugs, not found',
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
    Bug.findOne({
            _id: req.body.bugId,
        },
        function (err, bug) {
            if (err) {
                res.status(500).send({
                    error: 'Could not update user story, ' + err.message,
                });
            } else {
                if (bug === null) {
                    res.status(500).send({
                        error: 'Could not update bug, bug not found',
                    });
                } else {
                    if (err) {
                        res.status(500).send({
                            error: 'Could not update bug, ' + err.message,
                        });
                    } else {
                        bug.bugTitle = req.body.bugTitle;
                        bug.summary = req.body.summary;
                        bug.stepsToReproduce = req.body.stepsToReproduce;
                        bug.expectedResults = req.body.expectedResults;
                        bug.actualResults = req.body.actualResults;
                        bug.resolution = req.body.resolution;
                        bug.acceptanceCriteria = req.body.acceptanceCriteria;
                        bug.conversation = req.body.conversation;
                        bug.estimate = req.body.estimate;
                        bug.phase = req.body.phase;
                        bug.percentDone = req.body.percentDone;
                        bug.priority = req.body.priority;
                        bug.sprint = req.body.sprint;
                        bug.timeStampISO = timeStampISO;
                        bug.save(function (err, savedBug) {
                            if (err) {
                                res.status(500).send({
                                    error: 'Could not save bug, ' + err.message,
                                });
                            } else {
                                res.status(200).send(savedBug);
                            }
                        });
                    }
                }
            }
        }
    );
};

const putReturnBugProject = (req, res) => {
    var timeStampISO = getTimeStamp();
    Bug.findOne({
            _id: req.body.bugId,
        },
        function (err, bug) {
            if (err) {
                res.status(500).send({
                    error: 'Could not update bug, ' + err.message,
                });
            } else {
                if (bug === null) {
                    res.status(500).send({
                        error: 'Could not update bug, bug not found',
                    });
                } else {
                    if (err) {
                        res.status(500).send({
                            error: 'Could not update bug, ' + err.message,
                        });
                    } else {
                        bug.bugTitle = req.body.bugTitle;
                        bug.summary = req.body.summary;
                        bug.stepsToReproduce = req.body.stepsToReproduce;
                        bug.expectedResults = req.body.expectedResults;
                        bug.actualResults = req.body.actualResults;
                        bug.resolution = req.body.resolution;
                        bug.acceptanceCriteria = req.body.acceptanceCriteria;
                        bug.conversation = req.body.conversation;
                        bug.estimate = req.body.estimate;
                        bug.phase = req.body.phase;
                        bug.percentDone = req.body.percentDone;
                        bug.priority = req.body.priority;
                        bug.sprint = req.body.sprint;
                        bug.timeStampISO = timeStampISO;
                        bug.save(function (err, savedBug) {
                            if (err) {
                                res.status(500).send({
                                    error: 'Could not save bug, ' + err.message,
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
                                                                bug: savedBug,
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
    get: get,
    getBugs: getBugs,
    delete: del,
    deleteBugs: deleteBugs,
    postReturnBugProject: postReturnBugProject,
    put: put,
    putReturnBugProject: putReturnBugProject,
};