const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userStorySchema = new Schema({
    userRole: String,
    userWant: String,
    userBenefit: String,
    acceptanceCriteria: String, 
    conversation: String,
    estimate: Number,
    phase: String,
    percentDone: Number
});

var projectSchema = new Schema({
    name: String,
    userStories: [userStorySchema]
});

var developerSchema = new Schema({
    userName: String,
    userPassword: String,
    userProjects: [projectSchema]
});

module.exports = mongoose.model('Developer', developerSchema);