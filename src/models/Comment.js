const {Schema, model, Types:{ObjectId}} = require('mongoose');

const CommentSchema = new Schema({
    content : {type:String, required: true},
    user: { type: ObjectId, required: true, ref:'user'},
    board : {type:ObjectId, required: true, ref:'board'}
},
{timestamps : true});

const Comment = model('comment', CommentSchema);

module.exports = {Comment};