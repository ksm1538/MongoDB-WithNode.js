const mongoose = require('mongoose');

// schema 즉, 데이터의 정합성 체크 부분
const UserSchema = new mongoose.Schema({
    username:{type: String, required: true, unique: true},
    name: {type: String, required: true},
    age: String,
    email: String,
    nickname: String,
    gender: String
}, {timestamps: true});
// timestamps : 데이터가 생성된 시각을 넣는 기능

const User = mongoose.model('user', UserSchema);
module.exports = {User};