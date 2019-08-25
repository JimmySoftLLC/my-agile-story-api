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

module.exports = mongoose.model('Project', projectSchema);