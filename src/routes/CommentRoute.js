const {Router} = require('express');
const commentRouter = Router({mergeParams:true});       // mergeParams:true -> 앞에서 받은 파라미터도 같이 사용할 수 있는 지에 대한 여부
const {Comment, Board, User} = require('../models');
const {isValidObjectId} = require('mongoose');

commentRouter.get('/:commentId', async(request, response) => {
    const {boardId, commentId} = request.params;

    return response.send({boardId, commentId});
});

commentRouter.post('/', async(request, response) => {
    try{
        const { boardId } = request.params;
        const { content, userId } = request.body;
        
        if(!isValidObjectId(boardId))
            return response.status(400).send({error : "정확한 boardId 입력해주세요."});

        if(!isValidObjectId(userId))
            return response.status(400).send({error : "정확한 userId를 입력해주세요."});    

        if(typeof content != "string")    
            return response.status(400).send({error : "content를 입력해주세요."});    

        /*
        const board = await Board.findById(boardId);
        const user = await User.findById(userId);
        */

        // 위에 주석처리한 부분과 같은 호출이지만 Promise.all을 이용해 내부에 있는 로직을 한번에 호출할 수 있다.
        const [board, user] = await Promise.all([
            Board.findById(boardId),
            User.findById(userId)
        ]);

        if(board == null || user == null){
            return response.status(400).send({error : "게시판 또는 사용자가 존재하지 않습니다."});    
        }
        if(!board.isUse){
            return response.status(400).send({error : "해당 게시판이 삭제되었습니다."});    
        }

        const comment = new Comment({content, user, name:`${user.name}`, board});
        await Promise.all([
            comment.save(),
            Board.updateOne({_id : boardId}, {$push : {comments : comment}})
        ]);

        return response.send(comment);

    } catch(err){
        console.log(err);
        return response.status(500).send({ error : err.message });
    }
    
})

commentRouter.get('/', async(request, response) => {
    try{
        const {boardId} = request.params;
      
        if(!isValidObjectId(boardId))
            return response.status(400).send({error : "정확한 boardId 입력해주세요."});

        const comments = await Comment.find({board:boardId});
        return response.send({comments});
        
    } catch(err){
        console.log(err);
        return response.status(500).send({ error : err.message });
    }
})

module.exports = {commentRouter};