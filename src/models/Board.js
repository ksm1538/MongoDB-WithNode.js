const { Schema, model, Types } = require('mongoose');
const {CommentSchema} = require('./Comment');

const BoardSchema = new Schema({
    title : {type:String, required:true},                           // 제목
    content : {type:String, required:true},                         // 내용
    isUse : {type:Boolean, required:true, default:true},            // 사용 여부(true:사용, false:삭제)

    // user를 다시 조회하기 보단 아예 user정보를 같이 넣어주기 위함
    user : {
      _id : {type:Types.ObjectId, required:true, ref:"user"},        // User.js의 Schema 정의 이후 model 을 생성할 때 들어가는 변수를 넣어줘야함
      username:{type: String, required: true},                       // unique true X (한 아이디에서 여러 Board 작성 가능)
      name: {type: String, required: true},
    },

    // comment도 user와 마찬가지로 같이 정보를 넣어주되, 정의를 CommentSchema로 불러올 수도 있음.
    // comment 데이터가 생성된 후 Blog 데이터를 업데이트 하는 방식
    comments : [CommentSchema],
},                  
{timestamps: true});


/*
// 위에서 필드를 넣어줬으니 virtual 부분은 주석처리함
BoardSchema.virtual("comments",{
    ref:"comment",              // 매핑되는 컬렉션은 comment 
    localField:"_id",           // board Id 값과 매핑될 거고
    foreignField: "board"        // 매핑되는 대상은 comment의 blog 필드라는 뜻
});

// 위의 virutal 설정 완료
BoardSchema.set("toObject", {virtuals:true});
BoardSchema.set("toJSON", {virtuals:true});
*/
const Board = model('board', BoardSchema);

module.exports = {Board};

