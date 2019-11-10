# my-agile-story-api

## Overview

my-agile-story-api is a Node.js RESTful web service that is used by my-agile-story-web. It connects to a mongoDB database provisioned on mongoDB atlas.

## Models

my-agile-story-api uses the following three data schemas: developer, project and userStory.

### Developer

```javascript
var developerSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  bio: String,
  role: String,
  projectIds: [{ type: ObjectId, ref: "Project" }],
  timeStampISO: String
});
```

### Project

```javascript
var projectSchema = new Schema({
  name: String,
  description: String,
  developerIds: [{ type: ObjectId, ref: "Developer" }],
  userStoryIds: [{ type: ObjectId, ref: "UserStory" }],
  timeStampISO: String
});
```

### User Story

```javascript
var userStorySchema = new Schema({
  userStoryTitle: String,
  userRole: String,
  userWant: String,
  userBenefit: String,
  acceptanceCriteria: String,
  conversation: String,
  estimate: Number,
  phase: String,
  percentDone: Number,
  priority: Number,
  sprint: Number,
  projectId: { type: ObjectId, ref: "Project" },
  timeStampISO: String
});
```

## RESTful Apis

### Using post for get put and delete

GET, PUT, and DELETE do not allow you to send a JSON body. Some calls might have data that is longer than the 2000 character limitation of GET, PUT and DELETE. For example if you want to delete many records by Id. You can simply use `JSON.stringify` while creating a JSON body which is not limited to 2000 characters.

Also these methods can be logged on both the server and the client. This is undesirable for security reasons. Therefore we will be using POST for most methods.

### Using fetch

We recommend calling the REST methods with fetch which returns a promise. For example a typical post request would be as follows.

```javascript
var myDeveloper = {};
var errMessage = "";
fetch(URL_Address + "/developer", {
  method: "post",
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
    bio: bio,
    role: role
  })
})
  .then(res =>
    res.json().then(data => ({
      status: res.status,
      body: data
    }))
  )
  .then(obj => {
    if (obj.status === 200) {
      myDeveloper = obj.body;
      errMessage = "No Error";
      //do stuff with myDeveloper
    } else {
      errMessage = "Error" + obj.body.error;
      //do stuff with errMessage
    }
  });
```

## Post methods

### /developer

To create a new developer use `POST /developer` with a JSON body consisting of key value pairs: email, password, firstName, lastName, bio and role. ProjectIds are not passed. ProjectIds will be assigned later when the new developer creates a new project or is added to an existing project.

### /developer/project

To create a new project use `POST /project` with a JSON body consisting of key value pairs: name, description.

### /project/userStory

To create a new user story use `POST /project/userStory` with a JSON body consisting of key value pairs: userStoryTitle, userRole, userWant, userBenifit, acceptanceCriteria, conversation, estimate, phase, percentDone, priority, sprint, projectId.

## Get methods

### /get/developer

To get a developer use `POST /get/developer` with a JSON body consisting of key value pairs: email, password.

### /get/project

To get a project use `POST /get/project` with a JSON body consisting of key value pair: projectId. This is the endpoint that is used to check if the project changed buy comparing the timeStampISO to the one on the client side.

### /get/projects

To get an array of projects use `POST /get/projects` with a JSON body consisting of key value pair: projectIds. ProjectIds is a an array of projectId.

### /get/userStory

To get a user story use `POST /get/userStory` with a JSON body consisting of key value pair: projectId.

### /get/userStorys

To get an array of user stories use `POST /get/userStorys` with a JSON body consisting of key value pair: userStoryIds. userStoryIds is an array of userStoryId.

# Delete methods

### /delete/developer

To delete a developer uses `POST /delete/developer` with a JSON body consisting of key value pair: developerId.

### /delete/developer/project

To delete a developer from a project use `POST /delete/developer/project` with a JSON body consisting of key value pairs: developerId, projectId.

### /delete/project/userStory

To delete a user story from a project use `POST /delete/project/userStory` with a JSON body consisting of key value pairs: userStoryId, projectId.

### /delete/project/userStorys

To delete many user stories from a project use `POST /delete/project/userStory` with a JSON body consisting of key value pairs: userStoryIds, projectId. userStoryIds is an array of userStoryId.

# Put methods

### /put/developer

To edit a developer use `POST /put/developer` with a JSON body consisting of key value pairs: developerId, firstName, lastName, bio, and role. ProjectIds are not passed they will remain the same.

### /put/project

To edit a project use `POST /put/project` with a JSON body consisting of key value pairs: name, description.

### /put/userStory

To create a new user story use `POST /put/userStory` with a JSON body consisting of key value pairs: userStoryTitle, userRole, userWant, userBenifit, acceptanceCriteria, conversation, estimate, phase, percentDone, priority, sprint. ProjectId is not passed because it does not change.
