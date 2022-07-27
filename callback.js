const addSum = function(a, b, callback){
    setTimeout(function(){
        if(typeof a != "number" || typeof b != "number"){
            return callback('a and b must be number');
        }
        callback(undefined, a+b);
    }, 3000);
}

// 일반적인 callback 함수
let callback = (error, result) => {
    if(error)
        return console.log({error});
        console.log({result});
}

// 일반적인 callback 함수
addSum(10,20,callback);

// callback 함수 안에서 성공 시, 다시 addSum을 호출 하는 방법
// 아래처럼 다시 호출하려면 그만큼 깊게 계속 호출해야함 (변수이름도 바꿔줘야하므로 불편함)
addSum(10,20,(error, result) => {
    if(error)
        return console.log({error});

    console.log(result);
    addSum(result, 30, (error2, result2) => {
        if(error2)
            return console.log({error2});
            console.log({result2});
    });
});