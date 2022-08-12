const axios = require('axios');
const URI = 'http://localhost:3000';

console.log("client.js is running.");

const test = async() => {
    const {data:{board}} = await axios.get(`${URI}/board`);

    // promise.all : 동기처리를 한 번에 묶을 수 있는 방법.
    const boards = await Promise.all(board.map(async boardOne => {
        const [response1, response2] = await Promise.all([
            axios.get(`${URI}/user/${boardOne.user}`),
            axios.get(`${URI}/board/${boardOne._id}/comment`)
        ]);

         /* 위의 소스와 같은 기능이지만, 위에는 Promise.all을 한 번 더 감싸서 동시에 호출하도록 한 것
        const response1 = await axios.get(`${URI}/user/${boardOne.user}`);
        const response2 = await axios.get(`${URI}/board/${boardOne._id}/comment`);
        */

        boardOne.user = response1.data.user;
        boardOne.comments = await Promise.all(response2.data.comments.map(async comment => {
            const response = await axios.get(`${URI}/user/${comment.user}`);
            comment.user = response.data.user;

            return comment;
        }));

        return boardOne;
    }));

    console.dir(boards[0], {depth:10}); // 10 Depth까지 [Object] 내부를 모두 출력
}

test();