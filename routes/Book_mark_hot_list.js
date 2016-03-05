
var express = require('express');
var router = express.Router();
var db = require('./dbConn');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(__dirname);
    res.render('hello_html.html', { title: 'Express' });
});

router.post('/',function(req,res,next){
    var startIndex = req.body.startIndex;
    var endIndex = req.body.endIndex;
    
    var query = 

    db.pool.query('select book_thumb,book_name,book_url,book_idx,cnt,ROWNUM,favorite' +
        ' from (select A.book_thumb,A.book_name as book_name,A.book_url as book_url,B.book_idx as book_idx,A.book_favorite as favorite,B.cnt as cnt,@ROWNUM := @ROWNUM + 1 AS ROWNUM' +
        ' from (SELECT @ROWNUM := 0) R ,TB_BOOKMARK A INNER JOIN (select cnt,book_idx' +
        ' from (select count(book_index) as cnt,book_index as book_idx from (select * from TB_COMMENT where REGISTER_DATE >= DATE_SUB(SYSDATE(), INTERVAL 11 dAY)) as a' +
        ' group by book_index order by cnt desc) a ) B on A.book_index = B.book_idx order by cnt desc) as z where ROWNUM>=:startIndex AND ROWNUM <=:endIndex'
        ,{
                startIndex : startIndex,
                endIndex : endIndex
        }
        , function (err,result) {
        if (err) {//error가 존재한다면
            var result = {
                success: 0,
                result: {
                    message: err
                }
            }
            res.send(result);
            console.log(err);
        }
        else{
            //게시판 목록 결과
            var item = result.rows;

            //게시판 총 갯수
            db.pool.query('select count(*) as cnt from TB_BOOKMARK',function(err,cntResult){
                if(err){
                    var result = {
                        success:0,
                        result:{
                            message:"총 게시판 수 조회 실패 : "+err
                        }
                    }
                    console.log(result);
                    res.json(result);
                }
                else{
                    var send = {
                        success: 1,
                        item:item,
                        count:cntResult.rows[0].cnt
                    }
                    res.json(send);
                    console.log(send);
                }
            });
        }

    });
});


module.exports = router;