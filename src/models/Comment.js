const {Schema, model, Types:{ObjectId}} = require('mongoose');

const CommentSchema = new Schema({
    content : {type:String, required: true},
    user: { type: ObjectId, required: true, ref:'user', index: true},       // user에 index 생성
    name : { type: String, required: true},
    board : {type:ObjectId, required: true, ref:'board'}
},
{timestamps : true});

CommentSchema.index({board:1, createdAt:-1});

const Comment = model('comment', CommentSchema);

module.exports = {Comment, CommentSchema};