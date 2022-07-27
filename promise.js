const addSum = function(a, b){

    // resolve : 응답이 성공했을 떄
    // reject : 응답이 실패했을 때
    // resolve or reject 가 호출되면 해당 함수의 나머지 로직은 타지 않는다. (callback의 경우는 return 해주지 않으면 나머지 로직을 탐)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // a,b는 숫자만 인자로 받을 수 있다.
            if(typeof a != 'number' || typeof b != 'number'){
                reject('a and b must be number');
            }
            resolve(a+b);
        }, 3000);
    })
}

// 일반적인 promise 함수
addSum(10,20)
    .then(result => console.log({result}))
    .catch(error => console.log({error}));

// Promise 내에서 재호출 방법
addSum(10,20)
    .then(result => {
        console.log({result});
        return addSum(result, 30);
    })
    .then(result2 => console.log({result2}))
    .catch(error => console.log({error}));


// await를 이용한 재호출
const totalSum = async() => {
    try{
        let sum = await addSum(10,10);
        let sum2 = await addSum(sum, 10);

        console.log({sum, sum2});
    }catch(err){
        if(err)
            console.log(err);
    }
}
totalSum();