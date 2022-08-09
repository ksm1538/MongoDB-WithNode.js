const faker = require("faker");
const { User, Board, Comment } = require("./src/models");

generateFakeData = async (userCount, boardsPerUser, commentsPerUser) => {
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

  // Board 데이터 생성
  users.map( (user) => {
    for (let i = 0; i < boardsPerUser; i++) {
      boards.push(
        new Board({
          title: faker.lorem.words(),
          content: faker.lorem.paragraphs(),
          isUse: true,
          user,
        })
      );
    }
  });

  // Comment 데이터 생성
  users.map((user) => {
    for (let i = 0; i < commentsPerUser; i++) {
      let index = Math.floor(Math.random() * boards.length);   // comment를 넣을 boards 인덱스를 랜덤으로 조합

      comments.push(
        new Comment({
          content: faker.lorem.sentence(),
          user,
          board: boards[index]._id,
        })
      );
    }
  });

  console.log("===== 임시 데이터 삽입 시작 =====");

  await User.insertMany(users);
  console.log(`${users.length} 개의 사용자 데이터 생성 완료`);

  await Board.insertMany(boards);
  console.log(`${boards.length} 개의 게시판 데이터 생성 완료`);

  await Comment.insertMany(comments);
  console.log(`${comments.length} 개의 댓글 데이터 생성 완료`);

  console.log("===== 임시 데이터 삽입 완료 =====");
};

module.exports = { generateFakeData };