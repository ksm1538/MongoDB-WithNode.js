const {Router, response} = require('express');
const boardRouter = Router();

const {Board, User} = require('../models');
const {isValidObjectId} = require('mongoose');

const {commentRouter} = require('./CommentRoute');    // commentRouter 불러오기


// URL이 /board/:boardId/comment로 들어온 경우 commentRouter로 연결
boardRouter.use('/:boardId/comment', commentRouter);

// Board 데이터 추가
boardRouter.post('/', async(request, response) => {
    try{
        const { title, content, isUse, userId } = request.body;

        if(typeof title != "string" ) 
            return response.status(400).send({error:"title을 입력하세요."});
        if(typeof content != "string" ) 
            return response.status(400).send({error:"content을 입력하세요."});
        if(isUse && typeof isUse != "boolean" ) 
            return response.status(400).send({error:"isUse 입력하세요."});
        if(!isValidObjectId(userId))
            return response.status(400).send({error: "userId를 제대로 입력해주세요."});

        let user = await User.findById(userId);
        if(user == null)
            response.status(400).send({error: "해당 유저가 존재하지 않습니다."});

        let board = new Board({... request.body, user});
        await board.save();

        return response.send({board});
    } catch(err){
        console.log(err);
        response.status(500).send({error:err.message});
    }
});

// Board 데이터 조회
boardRouter.get('/', async(request, response) => {
    try{
        let { page } = request.query;
        page = parseInt(page);

        let limit = 3;
        let skip = limit * page;

        let board = await Board.find({})
            .sort({createdAt:-1})       // -1: 내림차순, 1: 오름차순
            .skip(skip)                 // skip의 갯수만큼 데이터를 제외하고 조회
            .limit(limit);              // 데이터 3개만 조회

        return response.send({board});
    } catch(err){
        console.log(err);
        response.status(500).send({error:err.message});
    }
});

// Board 특정 데이터만 조회(_id 이용)
boardRouter.get('/:boardId', async(request, response) => {
    try{
        const {boardId} = request.params;

        if(!isValidObjectId(boardId))
            response.status(400).send({error: "board를 제대로 입력해주세요."});
        
        let board = await Board.findOne({_id:boardId});

        response.send({board});
        
    } catch(err){
        console.log(err);
        response.status(500).send({error:err.message});
    }
});

// Board 특정 데이터 수정
boardRouter.put('/:boardId', async(request, response) => {
    try{
        const {title, content} = request.body;

        if(typeof title != "string" ) 
            response.status(400).send({error:"title을 입력하세요."});
        if(typeof content != "string" ) 
            response.status(400).send({error:"content을 입력하세요."});

        
        const {boardId} = request.params;

        if(!isValidObjectId(boardId))
            response.status(400).send({error: "boardId를 제대로 입력해주세요."});

        const board = await Board.findOneAndUpdate({_id:boardId}, {title, content}, {new : true});

        return response.send({board});
    } catch(err){
        console.log(err);
        response.status(500).send({error:err.message});
    }
});

// put : 전체 수정, patch : 부분 수정
// Board 특정 데이터의 isUse 필드만 수정
boardRouter.patch('/:boardId/isUse', async(request, response) => {
    try{
        const {boardId} = request.params;

        if(!isValidObjectId(boardId))
            response.status(400).send({error: "boardId를 제대로 입력해주세요."});

        const {isUse} = request.body;
        if(typeof isUse != "boolean")
            response.status(400).send({error: "isUse boolean형으로 입력해주세요."});
        
        const board = await Board.findByIdAndUpdate(boardId, {isUse}, {new: true});    
        
        return response.send({board});
    } catch(err){
        console.log(err);
        response.status(500).send({error:err.message});
    }
});

module.exports = {boardRouter};