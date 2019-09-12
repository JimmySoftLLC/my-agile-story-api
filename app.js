// ==================================================================
// SETUP
//
// A .env document is needed with the following parameters
// NODE_ENVIRONMENT=production or development
// PORT=****
// MONGO_USER=****
// MONGO_PASWORD=****
// ==================================================================
require('dotenv').config()

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const faker = require('faker');

//Allow all reqs from all domains & localhost
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// ==================================================================
// DATABASE
// ==================================================================

if (process.env.NODE_ENVIRONMENT === 'production') {
    const db = mongoose.connect('mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASWORD + '@cluster0-yxay5.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useCreateIndex: true
    }).then(() => {
        console.log('Connected to DB');
    }).catch(err => {
        console.log('ERROR:', err.message);
    });
} else {
    const db = mongoose.connect('mongodb://localhost/my-agile-story-api', {
        useNewUrlParser: true,
        useCreateIndex: true
    }).then(() => {
        console.log('Connected to DB');
    }).catch(err => {
        console.log('ERROR:', err.message);
    });
}

var Developer = require('./model/developer');
var Project = require('./model/project');
var UserStory = require('./model/user-story');

// ==================================================================
// POST ROUTES
// ==================================================================

app.post('/developer', function (req, res) {
    //first check if develop exists if so return and error
    Developer.findOne({
        email: req.body.email.toLowerCase()
    }, function (err, developerInDatabase) {
        if (err) {
            // res.render('home.ejs', {statusMessage: "Could not create developer, " + err.message} )
           res.status(500).send({
               error: "Could not create developer, " + err.message
           });
        } else {
            if (developerInDatabase !== null) {
                // res.render('home.ejs', {statusMessage: "Could not create developer, already exists."})
               res.status(500).send({
                   error: "Could not create developer, already exists."
               });
            } else {
                //developer doesn't exist so create a new one
                var developer = new Developer();
                developer.email = req.body.email.toLowerCase();
                developer.password = req.body.password;
                developer.firstName = req.body.firstName;
                developer.lastName = req.body.lastName;
                developer.bio = req.body.bio;
                developer.role = "admin" // TODO add req.body.role;
                developer.save(function (err, savedDeveloper) {
                    if (err) {
                        // res.render('home.ejs', {statusMessage: "Could not create developer, " + err.message} )
                       res.status(500).send({
                           error: "Could not create developer, " + err.message
                       });
                        
                    } else {
                        // res.render('home.ejs', {statusMessage: "Developer created sucessfully!"} )
                       res.status(200).send(savedDeveloper);
                    }
                });
            }
        }
    });
});



app.post('/developer/project', function (req, res) {
    Developer.findOne({
        _id: req.body.developerId
    }, function (err, developer) {
        if (err) {
            res.status(500).send({
                error: "Could not create project, " + err.message
            });
        } else {
            if (developer === null) {
                res.status(500).send({
                    error: "Could not create project, developer not found"
                });
            } else {
                var project = new Project();
                project.name = req.body.name;
                project.description = req.body.description;
                project.developerIds.push(developer._id);
                project.save(function (err, savedProject) {
                    if (err) {
                        res.status(500).send({
                            error: "Could not create project, " + err.message
                        });
                    } else {
                        developer.projectIds.push(savedProject._id);
                        developer.save(function (err, savedDeveloper) {
                            if (err) {
                                res.status(500).send({
                                    error: "Could not save developer, " + err.message
                                });
                            } else {
                                res.status(200).send(savedProject);
                            }
                        });
                    }
                });
            }
        }
    });
});

app.post('/project/userStory', function (req, res) {
    Project.findOne({
        _id: req.body.projectId
    }, function (err, project) {
        if (err) {
            res.status(500).send({
                error: "Could not create user story, " + err.message
            });
        } else {
            if (project === null) {
                res.status(500).send({
                    error: "Could not create user story, Project not found"
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
                userStory.projectId = req.body.projectId;
                userStory.save(function (err, savedUserStory) {
                    if (err) {
                        res.status(500).send({
                            error: "Could not create user story, " + err.message
                        });
                    } else {
                        project.userStoryIds.push(savedUserStory._id);
                        project.save(function (err, savedProject) {
                            if (err) {
                                res.status(500).send({
                                    error: "Could not save project, " + err.message
                                });
                            } else {
                                res.status(200).send(savedUserStory);
                            }
                        });
                    }
                });
            }
        }
    });
});

app.post('/put/userStory', function (req, res) {
    UserStory.findOne({
        _id: req.body.userStoryId
    }, function (err, userStory) {
        if (err) {
            res.status(500).send({
                error: "Could not update user story, " + err.message
            });
        } else {
            if (userStory === null) {
                res.status(500).send({
                    error: "Could not update user story, user not found"
                });
            } else {
                if (err) {
                    res.status(500).send({
                        error: "Could not update user story, " + err.message
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
                    userStory.save(function (err, savedUserStory) {
                        if (err) {
                            res.status(500).send({
                                error: "Could not save user story, " + err.message
                            });
                        } else {
                            res.status(200).send(savedUserStory);
                        }
                    });
                }
            }
        }
    });
});


// ==================================================================
// GET ROUTES some do not use HTTP GET inparticular for mongoose items, 
// primarly for security (i.e. login), and the need to use body for 
// complex JSON based search parameters.  These routes have the form /get/...
// ==================================================================

app.get('/', function (req, res) {
    res.render('home.ejs',{statusMessage: ""})
});

app.get('/heat-transfer', function (req, res) {
    res.render('heat-transfer.ejs', )
});

app.get('/heat-up', function (req, res) {
    res.render('heat-up.ejs', )
});

app.get('/process-load', function (req, res) {
    res.render('process-load.ejs', )
});

app.post('/get/developer', function (req, res) {
    Developer.findOne({
        email: req.body.email,
        password: req.body.password
    }, function (err, developer) {
        if (err) {
            res.status(500).send({
                error: "Could not get developer, " + err.message
            });
        } else {
            if (developer === null) {
                res.status(500).send({
                    error: "Could not get developer, not found"
                });
            } else {
                res.status(200).send(developer);
            }
        }
    });
});

app.post('/get/project', function (req, res) {
    Project.findOne({
        _id: req.body.projectId
    }, function (err, project) {
        if (err) {
            res.status(500).send({
                error: "Could not get project, " + err.message
            });
        } else {
            if (project === null) {
                res.status(500).send({
                    error: "Could not get project, not found"
                });
            } else {
                res.send(project);
            }
        }
    });
});

app.post('/get/projects', function (req, res) {
    Project.find({
        _id: { $in: req.body.projectIds}
    }, function (err, projects) {
        if (err) {
            res.status(500).send({
                error: "Could not get projects, " + err.message
            });
        } else {
            if (projects === null) {
                res.status(500).send({
                    error: "Could not get projects, not found"
                });
            } else {
                res.send(projects);
            }
        }
    });
});

app.post('/get/userStory', function (req, res) {
    UserStory.findOne({
        _id: req.body.userStoryId
    }, function (err, project) {
        if (err) {
            res.status(500).send({
                error: "Could not get project, " + err.message
            });
        } else {
            if (project === null) {
                res.status(500).send({
                    error: "Could not get project, not found"
                });
            } else {
                res.send(project);
            }
        }
    });
});

app.post('/get/userStorys', function (req, res) {
    UserStory.find({
        _id: { $in: req.body.userStoryIds}
    }, function (err, userStories) {
        if (err) {
            res.status(500).send({
                error: "Could not get user stories, " + err.message
            });
        } else {
            if (userStories === null) {
                res.status(500).send({
                    error: "Could not get stories, not found"
                });
            } else {
                res.send(userStories);
            }
        }
    });
});

// ==================================================================
// DELETE ROUTES
// ==================================================================

app.delete('/developer', function (req, res) {
    Developer.findOneAndDelete({
        _id: req.body.developerId
    }, function (err, developer) {
        if (err) {
            res.status(500).send({
                error: "Could not delete developer, " + err.message
            });
        } else {
            if (developer === null) {
                    res.status(500).send({
                        error: "Could not delete developer, not found"
                    });
                } else {
                    res.status(200).send({
                        result: "Success"
                    });
                }
        }
    });
});

app.post('/delete/developer/project', function (req, res) {
    Project.findOneAndDelete({
        _id: req.body.projectId
    }, function (err, project) {
        if (err) {
            res.status(500).send({
                error: "Could not delete project, " + err.message
            });
        } else {
            if (project === null) {
                res.status(500).send({
                    error: "Could not delete project, not found"
                });
            } else {
                Developer.findByIdAndUpdate(req.body.developerId, {
                        $pull: {
                            projectIds: mongoose.Types.ObjectId(req.body.projectId)
                        }
                    }, {
                        safe: true,
                        upsert: true
                    },
                    function (err, doc) {
                        if (err) {
                            res.status(500).send({
                                error: "Could not remove project from developer"
                            });
                        } else {
                            res.status(200).send({
                                result: "Success"
                            });
                        }
                    });
            }
        }
    });
});

app.post('/delete/project/userStory', function (req, res) {
    UserStory.findOneAndDelete({
        _id: req.body.userStoryId
    }, function (err, userStory) {
        if (err) {
            res.status(500).send({
                error: "Could not delete user story, " + err.message
            });
        } else {
            if (userStory === null) {
                res.status(500).send({
                    error: "Could not delete user story, not found"
                });
            } else {
                Project.findByIdAndUpdate(req.body.projectId, {
                    $pull: {
                        userStoryIds: mongoose.Types.ObjectId(req.body.userStoryId)
                    }
                    }, {
                        safe: true,
                        upsert: true
                    },
                    function (err, doc) {
                        if (err) {
                            res.status(500).send({
                                error: "Could not remove user story from project"
                            });
                        } else {
                            res.status(200).send({
                                result: "Success"
                            });
                        }
                    });
            }
        }
    });
});

app.post('/delete/project/userStorys', function (req, res) {
    UserStory.deleteMany({
        _id: { $in: req.body.userStoryIds}
    }, function (err, userStories) {
        if (err) {
            res.status(500).send({
                error: "Could not get user stories, " + err.message
            });
        } else {
            if (userStories === null) {
                res.status(500).send({
                    error: "Could not delete stories, not found"
                });
            } else {
                res.status(200).send({
                    result: "Success"
                });
            }
        }
    });
});

// ==================================================================
// PUT ROUTES
// ==================================================================



// ==================================================================
// NO ROUTES FOUND
// ==================================================================


app.post('*', function (req, res) {
    res.status(500).send({
        error: "That route does not exist"
    });
});

app.get('*', function (req, res) {
    res.status(500).send({
        error: "That route does not exist"
    });
});


app.delete('*', function (req, res) {
    res.status(500).send({
        error: "That route does not exist"
    });
});

app.put('*', function (req, res) {
    res.status(500).send({
        error: "That route does not exist"
    });
});

// ==================================================================
// END OF ROUTES
// ==================================================================

app.listen(process.env.PORT, process.env.IP, function () {
    console.log('My Agile Story running on port ' + process.env.PORT + '...');
});
