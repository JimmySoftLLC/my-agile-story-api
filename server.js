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
    var db = mongoose.connect('mongodb://localhost/my-agile-story-api', {
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

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/developer', function (request, response) {
    //first check if develop exists if so return and error
    Developer.findOne({
        userName: request.body.userName.toLowerCase()
    }, function (err, developerInDatabase) {
        if (err) {           
            response.status(500).send({error: "Could not create developer: " + request.body.userName.toLowerCase() + " err: " + err.message});
        } else {
            if (developerInDatabase !== null) {                     
                response.status(500).send({error: "Could not create developer: " + request.body.userName.toLowerCase() + " already exists."});
            } else {
                //developer doesn't exist so create a new one
                var developer = new Developer();
                developer.userName = request.body.userName.toLowerCase();
                developer.userPassword = request.body.userPassword;
                developer.save(function (err, savedDeveloper) {
                    if (err) {
                        response.status(500).send({error: "Could not create developer: " + request.body.userName.toLowerCase() + " err: " + err.message});
                    } else {
                        response.send(savedDeveloper);
                    }
                });
            }
        }
    });
});

app.copy('/developer', function (request, response) {
    //first check if developer exists if so return an error
    Developer.findOne({userName: request.body.userNameNew.toLowerCase() }, function (err, developer) {
        if (err) {          
            response.status(500).send({error: "Could not create developer: " + request.body.userName.toLowerCase() + " err: " + err.message});
        } else {
            if (developer !== null) {                   
                response.status(500).send({error: "Could not copy developer: " + request.body.userNameNew.toLowerCase() + " aleady exists."});
            } else {
                //developer doesn't exist so create a new one
                Developer.findOne({userName: request.body.userName.toLowerCase(),userPassword: request.body.userPassword}, function (err, developerToCopy) {
                    if (err) {
                        response.status(500).send({error: "Could not create developer: " + request.body.userNameNew.toLowerCase() + " err: " + err.message});
                    } else {
                        if (developerToCopy === null) {
                            response.status(500).send({error: "Could not find developer: " + request.body.userName.toLowerCase() + " does not exist."});
                        } else {
                            developerToCopy._id = mongoose.Types.ObjectId();
                            developerToCopy.isNew = true;
                            developerToCopy.userName = request.body.userNameNew.toLowerCase() 
                            developerToCopy.userPassword = request.body.userPasswordNew
                            developerToCopy.save(function (err, newDeveloper) {
                                if (err) {
                                    response.status(500).send({error: "Could not create developer: " + request.body.userName.toLowerCase() + " err: " + err.message});
                                } else {
                                    response.send(newDeveloper);
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});

app.get('/developer', function(request, response) {
    Developer.findOne({userName: request.body.userName.toLowerCase(), userPassword: request.body.userPassword}, function(err, savedDeveloper) {
       if (err) {
           response.status(500).send({error: "Could not create developer: " + request.body.userName.toLowerCase() + " err: " + err.message});
       } else {
           response.send(savedDeveloper);
       }
    });
});

app.delete('/developer', function(request, response) {
    Developer.findOneAndRemove({userName: request.body.userName.toLowerCase(), userPassword: request.body.userPassword}, function(err, savedDeveloper) {
       if (err) {
           response.status(500).send({error: "Could not create developer: " + request.body.userName.toLowerCase() + " err: " + err.message});
       } else {
           response.send(savedDeveloper);
       }
    });
});

app.listen(process.env.PORT, function() {
    console.log('My Agile Story running on port ' + process.env.PORT + '...');
});
