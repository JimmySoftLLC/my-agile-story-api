const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var bugSchema = new Schema({
  bugTitle: String,
  summary: String,
  stepsToReproduce: String,
  expectedResults: String,
  actualResults: String,
  resolution: String,
  acceptanceCriteria: String,
  expectedResults: String,
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

module.exports = mongoose.model('Bug', bugSchema);
