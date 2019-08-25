// A .env document is needed with the following parameters
// NODE_ENVIRONMENT=production or development
// PORT=****
// MONGO_USER=****
// MONGO_PASWORD=****
require('dotenv').config()

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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

//Allow all reqs from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/developer', function (req, res) {
    //first check if develop exists if so return and error
    Developer.findOne({
        userName: req.body.userName.toLowerCase()
    }, function (err, developerInDatabase) {
        if (err) {           
            res.status(500).send({error: "Could not create developer, " + err.message});
        } else {
            if (developerInDatabase !== null) {                     
                res.status(500).send({error: "Could not create developer, already exists."});
            } else {
                //developer doesn't exist so create a new one
                var developer = new Developer();
                developer.userName = req.body.userName.toLowerCase();
                developer.userPassword = req.body.userPassword;
                developer.save(function (err, savedDeveloper) {
                    if (err) {
                        res.status(500).send({error: "Could not create developer, " + err.message});
                    } else {
                        res.send(savedDeveloper);
                    }
                });
            }
        }
    });
});

app.get('/developer', function(req, res) {
    Developer.findOne({_id: req.body.developerId}, function(err, developer) {
       if (err) {
           res.status(500).send({error: "Could not get developer, " + err.message});
       } else {
            if (developer === null) {                     
                res.status(500).send({error: "Could not get developer, not found"});
            } else {
                res.send(developer);
            }
       }
    });
});

app.delete('/developer', function(req, res) {
    Developer.findOneAndDelete({_id: req.body.developerId}, function(err, developer) {
       if (err) {
           res.status(500).send({error: "Could not delete developer, " + err.message});
       } else {
            if (developer === null) {                     
                res.status(500).send({error: "Could not delete developer, not found"});
            } else {
                res.status(200).send("Success");
            }
       }
    });
});

app.post('/developer/project', function(req, res) {
    Developer.findOne({_id: req.body.developerId}, function(err, developer) {
       if (err) {
           res.status(500).send({error: "Could not create project, " + err.message});
       } else {
            if (developer === null) {                     
                res.status(500).send({error: "Could not create project, developer not found"});
            } else {           
                var project = new Project();
                project.name = req.body.projectName
                project.save(function (err, savedProject) {
                    if (err) {
                        res.status(500).send({error: "Could not create project, " + err.message});
                    } else {
                        developer.userName = req.body.userName.toLowerCase();
                        developer.projectIds.push(savedProject._id);
                        developer.save(function (err, savedDeveloper) {
                            if (err) {
                                res.status(500).send({error: "Could not save developer, " + err.message});
                            } else {
                                res.send(savedDeveloper);
                            }
                        });  
                    }
                });          
            }
       }
    });
});

app.get('/project', function(req, res) {
    Project.findOne({_id: req.body.projectId}, function(err, project) {
       if (err) {
           res.status(500).send({error: "Could not get project, " + err.message});
       } else {
            if (project === null) {                     
                res.status(500).send({error: "Could not get project, not found"});
            } else {
                res.send(project);
            }
       }
    });
});

app.delete('/developer/project', function(req, res) {
    Project.findOneAndDelete({_id: req.body.projectId}, function(err, project) {
       if (err) {
           res.status(500).send({error: "Could not delete project, " + err.message});
       } else {
            if (project === null) {                     
                res.status(500).send({error: "Could not delete project, not found"});
            } else {  
                Developer.findByIdAndUpdate(req.body.developerId,
                    {$pull: {projectIds: mongoose.Types.ObjectId(req.body.projectId)}},
                    {safe: true, upsert: true},
                    function(err, doc) {
                        if(err){
                            res.status(500).send({error: "Could not remove project from developer"});
                        }else{
                            res.status(200).send("Success");
                        }
                    });
            }
       }
    });
});

app.listen(process.env.PORT, function() {
    console.log('My Agile Story running on port ' + process.env.PORT + '...');
});
