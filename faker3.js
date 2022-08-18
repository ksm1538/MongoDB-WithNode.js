const faker = require("faker");
const { User } = require("./src/models");

generateFakeData3 = async (userCount) => {
  if (typeof userCount !== "number" || userCount < 1)
    throw new Error("userCount 는 양의 정수여야 합니다.");
  const users = [];
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
        username: faker.internet.userName() + parseInt(Math.random() * 10000000),  // 중복 방지를 위해 username 뒤에 랜덤 숫자를 넣음
        name: name,
        age: 20 + parseInt(Math.random() * 40),   // 20~60이 나오도록
        email: faker.internet.email(),
        nickname: name + "'s nickname",
        gender: g
      })
    );
  }

  console.log("===== 임시 데이터 삽입 시작 =====");

  await User.insertMany(users);
  console.log(`${users.length} 개의 사용자 데이터 생성 완료`);

  console.log("===== 임시 데이터 삽입 완료 =====");
};

module.exports = { generateFakeData3 };