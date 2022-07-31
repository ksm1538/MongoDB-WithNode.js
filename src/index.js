const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {User} = require('./models/User');

const MONGO_URI = 'mongodb+srv://seongmok:3751538@mongodbstudycluster.f1v7mjy.mongodb.net/Blog';

const server = async() => {
    try{
        await mongoose.connect(MONGO_URI);
        console.log("==== MongoDB Connected ====");
        
        // request의 데이터를 json 형태로 변환해주는 기능을 사용하겠다 라는 의미
        app.use(express.json());        

        // 포트 설정
        app.listen(3000, function(){
            console.log("server opened port : 3000");
        });

        // GET METHOD로 된 링크 설정
        app.get('/helloWorld', function(requset, response){
            return response.send("hello world");
        });

        /*** user API 정의(시작)  ***/

        // GET Method : 유저 조회
        app.get("/user", async (request, response) => {
            try{
                const users = await User.find({});

                return response.send({users})
            } catch(err){
                return response.status(500).send({ error : err.message });
            }
        });

        // GET Method : _id로 특정 데이터만 조회
        // 참고) url에 :을 넣으면 변수로 받을 수 있음
        app.get("/user/:userId", async (request, response) => {
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
        app.post("/user", async (request, response) => {
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
        app.delete("/user/:userId", async (request, response) => {
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
        app.put("/user/:userId", async (request, response) => {
            try{
                const {userId} = request.params;
                if(!mongoose.isValidObjectId(userId)){
                    return response.status(400).send({ error : "정확한 userId를 입력해주세요." }); 
                }

                const {email} = request.body;
                if(!email){
                    return response.status(400).send({ error : "email을 입력해주세요." }); 
                }
                // String 타입이 아닌 경우 에러 반환(그럴일은 없지만 변수 타입 체크 공부용)
                if(typeof email != "string"){
                    return response.status(400).send({ error : "email에 문자열을 입력해주세요." }); 
                }
                // updateOne : 해당 조건의 데이터를 삭제
                // findOneAndUpdate: 해당 조건의 데이터를 찾으면 수정(해당 데이터는 반환됨), 데이터를 못찾으면 null 반환
                // 3번째 인자에 new : true를 넣어줘야 update 이후의 데이터가 반환됨
                const user = await User.findOneAndUpdate(userId, { $set : {email} }, {new : true});

                return response.send({user})
            } catch(err){
                return response.status(500).send({ error : err.message });
            }
        });
        /*** user API 정의(끝)  ***/

    }catch(err){
        console.log(err);
    }
    
}

server();