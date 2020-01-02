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
let userStory = require('./api/userStoryAPI');
let bug = require('./api/bugAPI');
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
  userStory.post(req, res);
});

app.post('/project/userStory/returnUserStoryAndProject', function (req, res) {
  userStory.postReturnUserStoryProject(req, res);
});

app.post('/project/bug', function (req, res) {
  bug.post(req, res);
});

app.post('/project/bug/returnBugAndProject', function (req, res) {
  bug.postReturnBugProject(req, res);
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
  userStory.get(req, res);
});

app.post('/get/userStorys', function (req, res) {
  userStory.getUserStorys(req, res);
});

app.post('/get/bug', function (req, res) {
  bug.get(req, res);
});

app.post('/get/bugs', function (req, res) {
  bug.getBugs(req, res);
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
  userStory.delete(req, res);
});

app.post('/delete/project/userStorys', function (req, res) {
  userStory.deleteUserStorys(req, res);
});

app.post('/delete/project/bug', function (req, res) {
  bug.delete(req, res);
});

app.post('/delete/project/bugs', function (req, res) {
  bug.deleteBugs(req, res);
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
  userStory.put(req, res);
});

app.post('/put/userStory/returnUserStoryAndProject', function (req, res) {
  userStory.putReturnUserStoryProject(req, res);
});

app.post('/put/userStory/voteReturnUserStoryProject', function (req, res) {
  userStory.putVoteReturnUserStoryProject(req, res);
});

app.post('/put/bug', function (req, res) {
  bug.put(req, res);
});

app.post('/put/bug/returnBugAndProject', function (req, res) {
  bug.putReturnBugProject(req, res);
});

app.post('/put/bug/voteReturnBugProject', function (req, res) {
  bug.putVoteReturnBugProject(req, res);
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