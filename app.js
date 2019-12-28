// ==================================================================
// SETUP
//
// A .env document is needed with the following parameters
// NODE_ENVIRONMENT=production or development
// PORT=****
// MONGO_USER=****
// MONGO_PASSWORD=****
// ==================================================================
require('dotenv').config();
var fs = require('fs');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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

// ==================================================================
// DATABASE
// ==================================================================

if (process.env.NODE_ENVIRONMENT === 'production') {
  const db = mongoose
    .connect(
      'mongodb+srv://' +
      process.env.MONGO_USER +
      ':' +
      process.env.MONGO_PASSWORD +
      '@cluster0-yxay5.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useCreateIndex: true,
      }
    )
    .then(() => {
      dataBaseErrorMessage = 'Connected to DB';
      console.log('Connected to DB');
    })
    .catch(err => {
      dataBaseErrorMessage = 'ERROR:' + err.message;
      console.log('ERROR:', err.message);
    });
} else {
  const db = mongoose
    .connect('mongodb://localhost/my-agile-story-api', {
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log('Connected to DB');
    })
    .catch(err => {
      console.log('ERROR:', err.message);
    });
}

var Developer = require('./model/developer');
var Project = require('./model/project');
var UserStory = require('./model/user-story');
var Bug = require('./model/bug');

// ==================================================================
// Each record is marked with a unique timestamp to keep clients synchronized
// ==================================================================
function getTimeStamp() {
  var timeStampISO = new Date().toISOString();
  return timeStampISO;
}

// ==================================================================
// hashing functions for password
// ==================================================================

function hashPassword(password) {
  bcrypt.hash(password, 10, function (err, hash) {
    if (hash) {
      console.log(hash);
    } else {
      console.log(err);
    }
  });
}

// ==================================================================
// validation
// ==================================================================

notAllowed = [];

fs.readFile('bannedwords.txt', 'utf8', function (err, data) {
  if (err) throw err;
  let mystring = data.split("\n")
  for (let i = 0; i < mystring.length; i++) {
    notAllowed.push(mystring[i])
  }
});

function containsBlackListedStuff(myString) {
  if (myString === '') return false;
  // first check alpha numeric or . ? , space ! $ # are only in string
  let charNotValid = true;
  for (let i = 0; i < myString.length; i++) {
    charNotValid = true;
    let myASCIINumb = myString.charCodeAt(i);
    if (myASCIINumb >= 32 && myASCIINumb <= 39) charNotValid = false;
    if (myASCIINumb >= 48 && myASCIINumb <= 57) charNotValid = false;
    if (myASCIINumb >= 65 && myASCIINumb <= 90) charNotValid = false;
    if (myASCIINumb >= 97 && myASCIINumb <= 122) charNotValid = false;
    if (myASCIINumb === 44) charNotValid = false;
    if (myASCIINumb === 46) charNotValid = false;
    if (myASCIINumb === 63) charNotValid = false;
    if (myASCIINumb === 13) charNotValid = false;
    if (myASCIINumb === 10) charNotValid = false;
    if (charNotValid) {
      break;
    }
  }

  if (charNotValid) return true;

  // now check if bad words are present
  for (let i = 0; i < notAllowed.length; i++) {
    if (validator.contains(myString, notAllowed[i])) {
      return true;
    }
  }
  return false;
}

function validateInputs(req) {
  let validationResult = {
    pass: true,
    message: 'success',
  };

  if (!validator.isEmail(req.body.email.toLowerCase())) {
    validationResult.pass = false;
    validationResult.message = 'This is not a valid email address.';
  }

  if (containsBlackListedStuff(req.body.password)) {
    validationResult.pass = false;
    validationResult.message = 'This is not a valid password.';
  }

  if (req.body.oldPassword) {
    if (containsBlackListedStuff(req.body.oldPassword)) {
      validationResult.pass = false;
      validationResult.message = 'This is not a valid password.';
    }
  }

  if (containsBlackListedStuff(req.body.firstName)) {
    validationResult.pass = false;
    validationResult.message = 'This is not a valid first name.';
  }

  if (containsBlackListedStuff(req.body.lastName)) {
    validationResult.pass = false;
    validationResult.message = 'This is not a valid last name.';
  }

  if (containsBlackListedStuff(req.body.bio)) {
    validationResult.pass = false;
    validationResult.message = 'This is not a valid bio.';
  }

  if (containsBlackListedStuff(req.body.role)) {
    validationResult.pass = false;
    validationResult.message = 'This is not valid role.';
  }

  if (!validationResult.pass)
    validationResult.message +=
    '  Valid characters are alpha numeric, period, space, return, linefeed, ? ! $ #.';

  return validationResult;
}

// ==================================================================
// POST ROUTES
// ==================================================================

app.post('/developer', function (req, res) {
  const validationResult = validateInputs(req);
  if (!validationResult.pass) {
    res.status(500).send({
      error: validationResult.message,
    });
  } else {
    //first check if develop exists if so return and error
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
                var developer = new Developer();
                developer.email = req.body.email.toLowerCase();
                developer.password = hash;
                developer.firstName = req.body.firstName;
                developer.lastName = req.body.lastName;
                developer.bio = req.body.bio;
                developer.role = req.body.role;
                developer.timeStampISO = timeStampISO;
                developer.save(function (err, savedDeveloper) {
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
});

app.post('/developer/project', function (req, res) {
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
          project.developerIds.push(developer._id);
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
});

app.post('/developer/project/returnProjectAndDeveloper', function (req, res) {
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
          project.developerIds.push(developer._id);
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
  //hashPassword(req.body.password);
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
                developer.password = '';
                res.status(200).send(developer);
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
});

app.post('/get/project', function (req, res) {
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
});

app.post('/get/projects', function (req, res) {
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

app.delete('/developer', function (req, res) {
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
});

app.post('/delete/developer/project', function (req, res) {
  var timeStampISO = getTimeStamp();
  Project.findOneAndDelete({
      _id: req.body.projectId,
    },
    function (err, project) {
      if (err) {
        res.status(500).send({
          error: 'Could not delete project, ' + err.message,
        });
      } else {
        if (project === null) {
          res.status(500).send({
            error: 'Could not delete project, not found',
          });
        } else {
          Developer.findByIdAndUpdate(
            req.body.developerId, {
              $pull: {
                projectIds: mongoose.Types.ObjectId(req.body.projectId),
              },
              $set: {
                timeStampISO: timeStampISO,
              },
            }, {
              new: true,
              safe: true,
              upsert: true,
            },
            function (err, SavedDeveloper) {
              if (err) {
                res.status(500).send({
                  error: 'Could not remove project from developer',
                });
              } else {
                res.status(200).send(SavedDeveloper);
              }
            }
          );
        }
      }
    }
  );
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

app.post('/put/project', function (req, res) {
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
});

app.post('/put/project/returnProjectAndDeveloper', function (req, res) {
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
});

app.post('/put/developer', function (req, res) {
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
              bcrypt.compare(req.body.password, developer.password, function (
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
                        developer.firstName = req.body.firstName;
                        developer.lastName = req.body.lastName;
                        developer.email = req.body.email;
                        developer.password = hash;
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
});

app.post('/put/developer/changePassword', function (req, res) {
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