const { Schema, model, Types } = require('mongoose');

const BoardSchema = new Schema({
    title : {type:String, required:true},                           // 제목
    content : {type:String, required:true},                         // 내용
    isUse : {type:Boolean, required:true, default:true},            // 사용 여부(true:사용, false:삭제)
    user : {type:Types.ObjectId, required:true, ref:"user"},        // User.js의 Schema 정의 이후 model 을 생성할 때 들어가는 변수를 넣어줘야함 
}, 
{timestamps: true});

BoardSchema.virtual("comments",{
    ref:"comment",              // 매핑되는 컬렉션은 comment 
    localField:"_id",           // board Id 값과 매핑될 거고
    foreignField: "board"        // 매핑되는 대상은 comment의 blog 필드라는 뜻
});

// 위의 virutal 설정 완료
BoardSchema.set("toObject", {virtuals:true});
BoardSchema.set("toJSON", {virtuals:true});

const Board = model('board', BoardSchema);

module.exports = {Board};

