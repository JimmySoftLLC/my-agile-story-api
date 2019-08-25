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

module.exports = mongoose.model('UserStory', userStorySchema);