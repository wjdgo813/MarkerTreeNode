/**
 * Created by LG on 2016-03-02.
 */

var express = require('express');
var router = express.Router();
var db = require('./dbConn');

router.get('/', function(req, res, next) {
    console.log(__dirname);
    res.render('hello_html.html', { title: 'Express' });
});

router.post('/',function(req,res,next){
    var book_index = req.body.bookIndex;

    //해당 book_index의 댓글들의 정보를 조회한다 , com_yn = y인 것만 출력
    db.pool.query('select com_index,a.book_index,com_comment,com_pros,a.user_no,register_date,b.USER_NAME,c.book_favorite' +
        ' from TB_COMMENT a join TB_USER b on a.user_no=b.user_no' +
        ' join TB_BOOKMARK c on a.book_index =c.book_index'+
        ' where a.book_index = :book_index and com_yn="y" order by register_date',
        {
            book_index:book_index
        },function(err,result){
            if(err){

            }
            else{
                //해당 북_인덱스의 댓글 수 출력
                db.pool.query('select count(*) as cnt from TB_COMMENT where book_index= :book_index',{book_index:book_index},function(err,result2){
                    if(err){

                    }
                    else {

                        if(result2.rows[0] == undefined){
                            var send = {
                                count :0,
                                item : result.rows
                            }
                        }
                        else {
                            var send = {
                                count: result2.rows[0].cnt,
                                item: result.rows
                            }
                        }
                        console.log(send);
                        res.json(send);

                    }
                });
            }
        });

});
module.exports = router;