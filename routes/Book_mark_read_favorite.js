/**
 * Created by LG on 2016-03-06.
 */

var express = require('express');
var router = express.Router();
var db = require('./dbConn');

router.get('/',function(req,res,next){
    console.log(__dirname);
    res.render('hello_html.html', { title: 'Express' });
});

router.post('/',function(req,res,next){
    var favorite = req.body.book_favorite; //카테고리
    var startIndex = req.body.startIndex; //시작 row
    var endIndex = req.body.endIndex; //끝 row

    //해당 카테고리에 대한 북마크 출력
    db.pool.query('select book_thumb,book_name,book_url,book_idx,cnt,ROWNUM,favorite'+
   ' from (select A.book_thumb,A.book_name as book_name,A.book_url as book_url,B.book_idx as book_idx,A.book_favorite as favorite,B.cnt as cnt,@ROWNUM := @ROWNUM + 1 AS ROWNUM'+
    ' from (SELECT @ROWNUM := 0) R ,TB_BOOKMARK A INNER JOIN (select cnt,book_idx'+
    ' from (select count(book_index) as cnt,book_index as book_idx from TB_COMMENT'+
    ' group by book_index order by cnt desc) a ) B on A.book_index = B.book_idx where A.book_favorite=:book_favorite order by cnt desc) as z where ROWNUM>=:startIndex AND ROWNUM <=:endIndex ',
        {
            book_favorite:favorite,
            startIndex:startIndex,
            endIndex:endIndex
        },
    function(err,result){
        if(err){
            var errMessage={
                error:err
            }
            var send={
                item:errMessage
            }

            console.log(err);
            res.status(404);
            res.json(send);
        }
        else{
            var item = result.rows;
            //해당 카테고리의 총 갯수 출력
            db.pool.query('select count(*) as cnt from TB_BOOKMARK where book_favorite =:book_favorite',
                {
                    book_favorite:favorite
                },
            function(err,result2){
                if(err){
                    var errMessage={
                        error:err
                    }
                    var send2={
                        item:errMessage
                    }
                    console.log(err);
                    res.status(404); //실패 걍 404 에러로 퉁침
                    res.json(send2);
                }else{
                    var successSend={
                        item:item,
                        count:result2.rows[0].cnt
                    }
                    res.status(200);
                    res.json(successSend);
                }
            })

        }
    })
});

module.exports = router;