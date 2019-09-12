const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var projectSchema = new Schema({
    name: String, 
    description: String,
    developerIds: [{type: ObjectId, ref: 'Developer'}],
    userStoryIds: [{type: ObjectId, ref: 'UserStory'}]
});

module.exports = mongoose.model('Project', projectSchema);