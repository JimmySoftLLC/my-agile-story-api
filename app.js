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

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
let setUpDatabase = require('./db');
let developer = require('./api/developerAPI');
let project = require('./api/projectAPI');
let getTimeStamp = require('./api/getTimeStamp');

//Allow all reqs from all domains & localhost
app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'POST');
  next();
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.set('useFindAndModify', false);

setUpDatabase(mongoose);

var Project = require('./model/project');
var UserStory = require('./model/user-story');
var Bug = require('./model/bug');

// ==================================================================
// POST ROUTES
// ==================================================================

app.post('/developer', function (req, res) {
  developer.post(req, res);
});

app.post('/developer/project', function (req, res) {
  project.post(req, res);
});

app.post('/developer/project/returnProjectAndDeveloper', function (req, res) {
  project.postReturnObjects(req, res);
});

app.post('/project/userStory', function (req, res) {
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
});

app.post('/project/userStory/returnUserStoryAndProject', function (req, res) {
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
});

app.post('/project/bug', function (req, res) {
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
});

app.post('/project/bug/returnBugAndProject', function (req, res) {
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
});

// ==================================================================
// GET ROUTES some do not use HTTP GET in particular for mongoose items,
// primarily for security (i.e. login), and the need to use body for
// complex JSON based search parameters.  These routes have the form /get/...
// ==================================================================

app.get('/timestamp', function (req, res) {
  var timeStampISO = getTimeStamp();
  res.status(200).send(timeStampISO);
});

app.post('/get/developer', function (req, res) {
  developer.get(req, res);
});

app.post('/get/project', function (req, res) {
  project.get(req, res);
});

app.post('/get/projects', function (req, res) {
  project.getProjects(req, res);
});

app.post('/get/userStory', function (req, res) {
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
});

app.post('/get/userStorys', function (req, res) {
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
});

app.post('/get/bug', function (req, res) {
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
});

app.post('/get/bugs', function (req, res) {
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
});

// ==================================================================
// DELETE ROUTES
// ==================================================================

app.post('/developer', function (req, res) {
  developer.delete(req, res);
});

app.post('/delete/developer/project', function (req, res) {
  project.delete(req, res);
});

app.post('/delete/project/userStory', function (req, res) {
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
});

app.post('/delete/project/userStorys', function (req, res) {
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
});

app.post('/delete/project/bug', function (req, res) {
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
});

app.post('/delete/project/bugs', function (req, res) {
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
});

// ==================================================================
// PUT ROUTES
// ==================================================================

app.post('/put/developer', function (req, res) {
  developer.put(req, res);
});

app.post('/put/developer/changePassword', function (req, res) {
  developer.changePassword(req, res);
});

app.post('/put/project', function (req, res) {
  project.put(req, res);
});

app.post('/put/project/returnProjectAndDeveloper', function (req, res) {
  project.putReturnProjectDeveloper(req, res);
});

app.post('/put/userStory', function (req, res) {
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
});

app.post('/put/userStory/returnUserStoryAndProject', function (req, res) {
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
});

app.post('/put/bug', function (req, res) {
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
});

app.post('/put/bug/returnBugAndProject', function (req, res) {
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
});

// ==================================================================
// NO ROUTES FOUND
// ==================================================================

app.post('*', function (req, res) {
  res.status(500).send({
    error: 'That route does not exist',
  });
});

app.get('*', function (req, res) {
  res.status(500).send({
    error: 'That route does not exist',
  });
});

app.delete('*', function (req, res) {
  res.status(500).send({
    error: 'That route does not exist',
  });
});

app.put('*', function (req, res) {
  res.status(500).send({
    error: 'That route does not exist',
  });
});

// ==================================================================
// END OF ROUTES
// ==================================================================

app.listen(process.env.PORT, process.env.IP, function () {
  console.log('My Agile Story running on port ' + process.env.PORT + '...');
});