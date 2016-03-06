var express = require('express');
var router = express.Router();
var db = require('./dbConn');
var encode = require('urlencode');
router.get('/', function(req, res, next) {
    console.log(__dirname);
    res.render('hello_html.html', { title: 'Express' });
});

router.post('/',function(req,res,next){
    var book_favorite = req.body.book_favorite;
    book_favorite = encode.decode(book_favorite);
    //req.com_comment = encode.decode(req.com_comment);
    var user_email = req.body.user_email;
    var startIndex = req.body.startIndex;
    var endIndex = req.body.endIndex;
    //카테고리 전체 보기
    if(book_favorite=="전체") {
        db.pool.query('select book_name,book_thumb,book_url,book_index,book_favorite from' +
            ' (select book_name,book_url,book_thumb,b.book_index as book_index,book_favorite,@ROWNUM := @ROWNUM  +1 AS ROWNUM' +
            ' from TB_BOOKMARK a' +
            ' inner join (select * from TB_COMMENT where user_no = (select user_no from TB_USER where user_email=:user_email) and com_yn="Y" ' +
            ' order by com_index desc) b on a.book_index = b.book_index' +
            ' inner join (select @ROWNUM := 0) R order by com_index desc) c' +
            ' where ROWNUM>=:startIndex AND ROWNUM <=:endIndex',
            {
                user_email: user_email,
                startIndex: startIndex,
                endIndex: endIndex
            }
            , function (err, result) {
                if (err) {

                    var errMessage = {
                        error: err
                    }
                    var send = {
                        item: errMessage
                    }

                    console.log(err);
                    res.status(404);
                    res.json(send);
                }
                else {
                    var item = result.rows; //자신의 북마크 리스트

                    //내 북마크 갯수 select
                    db.pool.query('select count(*) as cnt from TB_COMMENT where user_no = (select user_no from TB_USER where user_email=:user_email) and com_yn="Y"',
                        {
                            user_email: user_email
                        },
                        function (err, result2) {
                            if (err) {
                                var errMessage = {
                                    error: err
                                }
                                var send2 = {
                                    item: errMessage
                                }
                                console.log(err);
                                res.status(404); //실패 걍 404 에러로 퉁침
                                res.json(send2);
                            }
                            else {
                                var successSend = {
                                    item: item,
                                    count: result2.rows[0].cnt
                                }
                                res.status(200);
                                res.json(successSend);
                            }
                        })
                }
            }
        );
    }
    //해당 카테고리 출력
    else{
        db.pool.query('select book_name,book_thumb,book_url,book_index,book_favorite from'+
        ' (select book_name,book_url,book_thumb,b.book_index as book_index,book_favorite,@ROWNUM := @ROWNUM  +1 AS ROWNUM'+
        ' from TB_BOOKMARK a'+
        ' inner join (select * from TB_COMMENT where user_no = (select user_no from TB_USER where user_email=:user_email) and com_yn="Y"'+
        ' order by com_index desc) b on a.book_index = b.book_index'+
        ' inner join (select @ROWNUM := 0) R where book_favorite=:book_favorite order by com_index desc) c'+
        ' where ROWNUM>=:startIndex AND ROWNUM <=:endIndex',
            {
                user_email:user_email,
                book_favorite:book_favorite,
                startIndex : startIndex,
                endIndex:endIndex
            }, function (err, result) {
                if (err) {

                    var errMessage = {
                        error: err
                    }
                    var send = {
                        item: errMessage
                    }

                    console.log(err);
                    res.status(404);
                    res.json(send);
                }
                else {
                    var item = result.rows; //자신의 북마크 리스트

                    //내 북마크 갯수 select
                    db.pool.query('select count(*) as cnt from (select book_index from TB_COMMENT' +
                        ' where user_no = (select user_no from TB_USER where user_email=:user_email) and com_yn="Y") a'+
                    ' JOIN (select book_index from TB_BOOKMARK where book_favorite=:book_favorite) b on a.book_index = b.book_index'
                    ,
                        {
                            user_email: user_email,
                            book_favorite:book_favorite
                        },
                        function (err, result2) {
                            if (err) {
                                var errMessage = {
                                    error: err
                                }
                                var send2 = {
                                    item: errMessage
                                }
                                console.log(err);
                                res.status(404); //실패 걍 404 에러로 퉁침
                                res.json(send2);
                            }
                            else {
                                var successSend = {
                                    item: item,
                                    count: result2.rows[0].cnt
                                }
                                res.status(200);
                                res.json(successSend);
                            }
                        })
                }
            }
        );
    }
});

module.exports = router;