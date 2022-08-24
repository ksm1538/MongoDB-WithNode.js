const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {generateFakeData} = require("../faker");
const {generateFakeData2} = require("../faker2");
const {generateFakeData3} = require("../faker3");

const {userRouter, boardRouter} = require('./routes');          // userRouter 불러오기

// env환경변수를 이용해서 git에 보안 정보들이 올라가지 않게 할 수 있음.
// 설치 : npm i env-cmd
// 최상위 디렉터리의 .env 파일에 MONGO_URI를 정의하면 된다. (공백이 있으면 안됨)
// .env 파일을 .gitignore 파일에 등록해두면 git에 커밋되지 않기 때문에 보안 정보를 커밋하지 않을 수 있다.
const {MONGO_URI, PORT} = process.env;        // package.json에 env-cmd를 앞에 적어줘야함

const server = async() => {
    try{

        await mongoose.connect(MONGO_URI);
        //mongoose.set("debug", true);        // 쿼리를 콘솔에 보이고 싶을 때

        console.log("==== MongoDB Connected ====");
        
        // 생성완료하였으니 주석 처리
        // await generateFakeData(100, 10, 200);      // 임시 데이터 생성

        
        // request의 데이터를 json 형태로 변환해주는 기능을 사용하겠다 라는 의미
        app.use(express.json());        

        // 포트 설정
        app.listen(PORT, async () => {
            console.log(`server opened port : ${PORT}`);
            //await generateFakeData2(10, 3, 10);  // 임시 데이터 생성 2
            //await generateFakeData3(1000000);  // 임시 데이터 생성 3
        });

        // GET METHOD로 된 링크 설정
        app.get('/helloWorld', function(requset, response){
            return response.send("hello world");
        });

        // URL이 /user로 들어온 경우 userRouter로 연결
        app.use('/user', userRouter);

        // URL이 /board로 들어온 경우 boardRouter로 연결
        app.use('/board', boardRouter);
    }catch(err){
        console.log(err);
    }
    
}

server();