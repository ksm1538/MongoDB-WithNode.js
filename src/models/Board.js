const { Schema, model, Types } = require('mongoose');

const BoardSchema = new Schema({
    title : {type:String, required:true},                           // 제목
    content : {type:String, required:true},                         // 내용
    isUse : {type:Boolean, required:true, default:true},            // 사용 여부(true:사용, false:삭제)
    user : {type:Types.ObjectId, required:true, ref:"user"},        // User.js의 Schema 정의 이후 model 을 생성할 때 들어가는 변수를 넣어줘야함 
}, 
{timestamps: true});

const Board = model('board', BoardSchema);

module.exports = {Board};