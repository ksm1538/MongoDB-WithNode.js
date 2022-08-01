const express = require('express');
const app = express();
const mongoose = require('mongoose');

const {userRouter} = require('./routes/userRoute');     // UserRouter 불러오기

const MONGO_URI = 'mongodb+srv://seongmok:3751538@mongodbstudycluster.f1v7mjy.mongodb.net/Blog';

const server = async() => {
    try{
        await mongoose.connect(MONGO_URI);
        mongoose.set("debug", true);

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

        // URL이 /user로 들어온 경우 userRouter로 연결
        app.use('/user', userRouter);

    }catch(err){
        console.log(err);
    }
    
}

server();