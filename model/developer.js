const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var developerSchema = new Schema({
    userName: String,
    userPassword: String,
    projectIds: [{type: ObjectId, ref: 'Project'}]
});

module.exports = mongoose.model('Developer', developerSchema);