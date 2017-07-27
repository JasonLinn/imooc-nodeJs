
const Comment = require('../models/comment.js');
//admin post movie
exports.save = function (req, res) {
    var _comment = req.body.comment;
    var movieId = _comment.movie;

    if(_comment.cid){
        Comment.findById(_comment.cid,function (err,comment){
            var reply ={
                from: _comment.from,
                to: _comment.tid,
                content:_comment.content
            }
            comment.reply.push(reply);
            comment.save(function (err,comment){
                if (err) {
                    console.log("我是错误，我在这里");
                    console.log(err);
                }
                console.log("跳转之前电影的id是：" + movieId);
                res.redirect('/movie/' + movieId);
                console.log("这里是跳转之后");
            })
        })
    }else{
        console.log("跳转之前电影的id是：" + movieId);
        res.redirect('/movie/' + movieId);
        console.log("这里是跳转之后");
    }


    var comment = new Comment(_comment);
    
    comment.save(function (err, comment) {
        if (err) {
            console.log("我是错误，我在这里");
            console.log(err);
        }
        console.log("跳转之前电影的id是：" + movieId);
        res.redirect('/movie/' + movieId);
        console.log("这里是跳转之后");
    });
};
