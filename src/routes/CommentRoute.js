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

        const comment = new Comment({
            content, 
            user, 
            name:`${user.name}`, 
            board:boardId
        });

        board.commentsCount++;
        board.comments.push(comment);
        
        // 게시판의 내장 댓글은 3개만 하며 최신순으로 함. 3개가 넘었을 때 신규 댓글이 작성되면 오래된 댓글은 삭제됨(comments에서 확인해야함)
        if(board.commentsCount>3){
            board.comments.shift();
        }
        /*
        await Promise.all([
            comment.save(),
            Board.updateOne({_id : boardId}, {$push : {comments : comment}})
        ]);
        */

        await Promise.all([
            comment.save(),
            board.save()
        ])
        await comment.save();

        return response.send(comment);

    } catch(err){
        console.log(err);
        return response.status(500).send({ error : err.message });
    }
    
})

commentRouter.get('/', async(request, response) => {
    try{
        let { page=0 } = request.query; // 주소창에 넣은 파라미터는 query를 이용해서 가져와야함. page=0 : 0을 기본값으로 한다는 뜻
        let { boardId } = request.params;
        console.log({page});
        let limit = 3;
        let skip = page * limit;
      
        if(!isValidObjectId(boardId))
            return response.status(400).send({error : "정확한 boardId 입력해주세요."});

        const comments = await Comment.find({board:boardId})
                                    .sort({createdAt:-1})
                                    .skip(skip)
                                    .limit(limit);

        return response.send({comments});
        
    } catch(err){
        console.log(err);
        return response.status(500).send({ error : err.message });
    }
})

commentRouter.patch("/:commentId", async(request, response) => {
    const {commentId} = request.params;
    const {content} = request.body;

    if(typeof content != "string"){
        return response.status(400).send({err:"변경할 내용을 입력해주세요."});
    }

    const [comment] = await Promise.all([
        Comment.findOneAndUpdate({_id:commentId}, {content}, {new : true}),
        Board.updateOne(
            {"comments._id" : commentId},
            {"comments.$.content" : content}
        )
    ]);

    return response.send({comment});
});

commentRouter.delete("/:commentId", async(request, response) => {
    const {commentId} = request.params;
    const comment = await Comment.findOneAndDelete({_id : commentId});

    await Board.updateOne(
        {"comments._id" : commentId},               // boards안의 comments 배열 중 _id가 commentId와 같은 데이터를
        {$pull : {comments: {_id : commentId}}}     // $pull : 삭제하겠다.
    );

    return response.send({comment});
});

module.exports = {commentRouter};