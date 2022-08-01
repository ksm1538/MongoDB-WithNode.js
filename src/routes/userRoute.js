const mongoose = require('mongoose');
const { Router } = require('express');
const userRouter = Router();
const {User} = require('../models/User');                // schema 설정 내용 불러오기

/*** user API 정의(시작)  ***/

// GET Method : 유저 조회
userRouter.get("/", async (request, response) => {
    try{
        const users = await User.find({});

        return response.send({users})
    } catch(err){
        return response.status(500).send({ error : err.message });
    }
});

// GET Method : _id로 특정 데이터만 조회
// 참고) url에 :을 넣으면 변수로 받을 수 있음
userRouter.get("/:userId", async (request, response) => {
    try{
        const {userId} = request.params;

        // 파라미터로 넘어온 userId가 몽고DB의 _id 형식인지 확인 후 아니라면 에러 반환
        if(!mongoose.isValidObjectId(userId)){
            return response.status(400).send({ error : "정확한 userId를 입력해주세요." }); 
        }
        const user = await User.findOne({_id:userId});

        return response.send({user})
    } catch(err){
        return response.status(500).send({ error : err.message });
    }
});

// POST Method : 유저 추가
// await를 사용하기 위해서는 async를 사용해야함
userRouter.post("/", async (request, response) => {
    try{

        // let username = request.body.username; let name = request.body.name; 와 같은 구문
        let {username, name} = request.body;

        // 필수 값인 username과 name에 값이 있는 지 확인
        if(!username || !name){
            return response.status(400).send({ error : "username, name을 입력해주세요." });
        }
        const user = new User(request.body);
        await user.save();

        response.send({user});
    // 서버에서 오류가 발생한 경우 catch문에서 알림
    }catch(err){
        return response.status(500).send({ error : err.message });
    }
    
});

// DELETE Method : _id로 특정 데이터만 삭제
userRouter.delete("/:userId", async (request, response) => {
    try{
        const {userId} = request.params;

        // 파라미터로 넘어온 userId가 몽고DB의 _id 형식인지 확인 후 아니라면 에러 반환
        if(!mongoose.isValidObjectId(userId)){
            return response.status(400).send({ error : "정확한 userId를 입력해주세요." }); 
        }

        // deleteOne : 해당 조건의 데이터를 삭제
        // findOneAndDelete : 해당 조건의 데이터를 찾으면 삭제(해당 데이터는 반환됨), 데이터를 못찾으면 null 반환
        const user = await User.findOneAndDelete({_id:userId});

        return response.send({user})
    } catch(err){
        return response.status(500).send({ error : err.message });
    }
});

// PUT Method : _id로 특정 데이터만 수정
userRouter.put("/:userId", async (request, response) => {
    try{
        const {userId} = request.params;
        if(!mongoose.isValidObjectId(userId)){
            return response.status(400).send({ error : "정확한 userId를 입력해주세요." }); 
        }

        const {email, name} = request.body;

        if(!email && !name){
            return response.status(400).send({ error : "email과 name을 입력해주세요." }); 
        }

        // null이 아닐 경우에만 updateData에 변경할 필드 데이터를 넣어줌 (null도 수정되기 때문에 아래와 같이 설정함)
        /*let updateData = {};
        if(email){
            updateData.email = email;
        }
        if(name){
            updateData.name = name;
        }

        // updateOne : 해당 조건의 데이터를 삭제
        // findOneAndUpdate: 해당 조건의 데이터를 찾으면 수정(해당 데이터는 반환됨), 데이터를 못찾으면 null 반환
        // 3번째 인자에 new : true를 넣어줘야 update 이후의 데이터가 반환됨
        const user = await User.findOneAndUpdate(userId, updateData, {new : true});
        */

        // findOneAndUpdate가 아닌 findOne 후 이 객체를 수정해서 save()하는 방식
        let user = await User.findById(userId);
        if(email){
            user.email = email;
        }
        if(name){
            user.name = name;
        }
        await user.save();
        return response.send({user})
    } catch(err){
        return response.status(500).send({ error : err.message });
    }
});
/*** user API 정의(끝)  ***/

module.exports = {
    userRouter
}