const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var projectSchema = new Schema({
  name: String,
  description: String,
  userStoryIds: [{
    type: ObjectId,
    ref: 'UserStory'
  }],
  bugIds: [{
    type: ObjectId,
    ref: 'BugStory'
  }],
  developers: [],
  timeStampISO: String,
});

module.exports = mongoose.model('Project', projectSchema);