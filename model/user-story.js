const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

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
  projectId: {
    type: ObjectId,
    ref: 'Project',
  },
  votes: [],
  developers: [],
  timeStampISO: String,
});

module.exports = mongoose.model('UserStory', userStorySchema);
