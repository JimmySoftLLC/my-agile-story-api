const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var developerSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    bio: String,
    role: String,
    projectIds: [{type: ObjectId, ref: 'Project'}]
});

module.exports = mongoose.model('Developer', developerSchema);