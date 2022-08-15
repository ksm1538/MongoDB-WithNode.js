const faker = require("faker");
const { User } = require("./src/models");
const axios = require("axios");
const URI = "http://localhost:3000";

/**
  faker1.js 와는 다르게 mongoDB에 직접 붙는 것이 아니라,
  axios로 호출을 하여 데이터를 추가하는 방식이므로 너무 많은 데이터를 넣으려고 하면 오류 발생함
 */
generateFakeData2 = async (userCount, boardsPerUser, commentsPerUser) => {
  try{
    if (typeof userCount !== "number" || userCount < 1)
    throw new Error("userCount 는 양의 정수여야 합니다.");
    if (typeof boardsPerUser !== "number" || boardsPerUser < 1)
    throw new Error("boardsPerUser 는 양의 정수여야 합니다.");
    if (typeof commentsPerUser !== "number" || commentsPerUser < 1)
    throw new Error("commentsPerUser 는 양의 정수여야 합니다.");
    const users = [];
    const boards = [];
    const comments = [];
    console.log("임시 데이터 준비중...");

    for (let i = 0; i < userCount; i++) {
        let g;
        if(i % 2 == 0) 
          g = 'M';
        else
          g = 'W';
    
        let name = faker.name.lastName();
        // User 데이터 생성
        users.push(
          new User({
            username: faker.internet.userName() + parseInt(Math.random() * 100),  // 중복 방지를 위해 username 뒤에 랜덤 숫자를 넣음
            name: name,
            age: 20 + parseInt(Math.random() * 40),   // 20~60이 나오도록
            email: faker.internet.email(),
            nickname: name + "'s nickname",
            gender: g
          })
        );
      }

    await User.insertMany(users);
    console.log(`${users.length} 개의 유저 정보 생성완료`);

    users.map((user) => {
      for (let i = 0; i < boardsPerUser; i++) {
        boards.push(
          axios.post(`${URI}/board`, {
            title: faker.lorem.words(),
            content: faker.lorem.paragraphs(),
            isUse: true,
            userId: user.id
          })
        );
      }
    });

    const newBoards = await Promise.all(boards);    // newBoards 안에는 데이터를 추가하면서 생성되는 _id 가 있음
    console.log(`${newBoards.length} 개의 블로그 정보 생성 완료`);

    users.map((user) => {
      for (let i = 0; i < commentsPerUser; i++) {
        let index = Math.floor(Math.random() * newBoards.length);
        comments.push(
          axios.post(`${URI}/board/${newBoards[index].data.board._id}/comment`, {
            content: faker.lorem.sentence(),
            userId: user.id,
          })
        );
      }
    });

    await Promise.all(comments);
    console.log(`${comments.length} 개의 댓글 정보 생성 완료!`);
    console.log("완료");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { generateFakeData2 };