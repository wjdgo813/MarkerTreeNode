var express = require('express');
var router = express.Router();
var db = require('./dbConn');

router.get('/', function(req, res, next) {
    console.log(__dirname);
    res.render('hello_html.html', { title: 'Express' });
});

router.post('/',function(req,res,next){
    var user_email = req.body.user_email;
    var startIndex = req.body.startIndex;
    var endIndex = req.body.endIndex;
    db.pool.query('select * from'+
    ' (select book_name,book_url,b.book_index,@ROWNUM := @ROWNUM  +1 AS ROWNUM'+
    ' from TB_BOOKMARK a'+
    ' inner join (select * from TB_COMMENT where user_no = (select user_no from TB_USER where user_email=:user_email)' +
    ' order by com_index desc) b on a.book_index = b.book_index'+
    ' inner join (select @ROWNUM := 0) R order by com_index desc) c'+
    ' where ROWNUM>=:startIndex AND ROWNUM <=:endIndex',
        {
            user_email:user_email,
            startIndex:startIndex,
            endIndex:endIndex
        }
        ,function(err,result){
        if(err){

            var send={
                message:err
            };
            console.log(err);
            res.status(404);
            res.json(send);
        }
        else{
            var item = result.rows; //자신의 북마크 리스트

            //내 북마크 갯수 select
            db.pool.query('select count(*) as cnt from TB_COMMENT where user_no = (select user_no from TB_USER where user_email=:user_email)',
                {
                    user_email:user_email
                },
            function(err,result2){
                if(err){
                    var send2={
                        message:err
                    }
                    console.log(err);
                    res.status(404); //실패 걍 404 에러로 퉁침
                    res.json(send2);
                }
                else{
                    var send2={
                        item:item,
                        count:result2.rows[0].cnt
                    }
                    res.status(200);
                    res.json(send2);
                }
            })
        }
    }
    );
});

module.exports = router;