
var express = require('express');
var router = express.Router();
var db = require('./dbConn');
var encode = require('urlencode');
var driver = require('node-phantom-simple');
var gm = require('gm');
var async = require('async');

var dir = __dirname + '/images/thumbs/'; 
var url = "";
var title = "";
var thumbName = "";

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(__dirname);
    res.render('hello_html.html', { title: 'Express' });
});


var sign_up_post = function (req, res) {
    console.log(req.user_email);
    //해당 사용자에 북마크가 저장되어 있는지 확인
    db.pool.query('select * from TB_COMMENT where book_index = (select book_index from TB_BOOKMARK where book_url=:book_url and book_favorite =:book_favorite)'+
        'and USER_NO = (select user_no from TB_USER where user_email =:user_email)',{book_url:req.book_url,book_favorite:req.book_favorite,user_email:req.user_email},
        function(err,result){

            if(err){
                var send={
                    success:0,
                    result:{
                        message:err
                    }
                };
                res.json(send);
            }else{
                if(result.rows[0] != undefined){
                    //사용자의 저장소에 이미 등록되어 있음
                    var send={
                        success:0,
                        result:{
                            message:"이미 저장되어 있습니다."
                        }
                    };
                    res.json(send);
                }
                else{
                    //등록되어 있지 않은 경우
                    //BOOKMARK 테이블에 URL 존재 유무 확인
                    db.pool.query('select count(*) as num from TB_BOOKMARK where book_url=:url and book_favorite =:book_favorite group by book_url ',
                        {url: req.book_url,book_favorite:req.book_favorite}, function (err, result) {
                            if (err) {//error 諛쒖깮
                                var result = {
                                    success: 0,
                                    result: {
                                        message: err
                                    }
                                }
                                res.send(result);
                                console.log(err);
                            }
                            // console.log(result);
                            else {
                                console.log(result.rows[0]);
                                if (result.rows[0] != undefined) { //BOOKMARK 테이블에 해당 URL이 이미 저장되어 있을 경우 댓글만 저장

                                    db.pool.query('INSERT INTO TB_COMMENT(BOOK_INDEX,COM_COMMENT,COM_PROS,USER_NO,REGISTER_DATE) ' +
                                        ' VALUES((select book_index from TB_BOOKMARK where book_url=:book_url and book_favorite=:book_favorite),:com_comment,:com_pros,(SELECT USER_NO FROM TB_USER where USER_EMAIL=:user_email),sysdate())',
                                        {
                                            book_url:req.book_url,
                                            book_favorite:req.book_favorite,
                                            com_comment:req.com_comment,
                                            com_pros:req.com_pros,
                                            user_email:req.user_email
                                        },
                                        function(err,result2){
                                            if(err){
                                                var create_result = {
                                                    success: 0,
                                                    result: {
                                                        message: err
                                                    }
                                                }
                                                res.send(create_result);
                                                console.log(err);
                                            }
                                            else{
                                                var create_result={
                                                    success:1,
                                                    result:{
                                                        message:"저장 완료"
                                                    }
                                                }
                                                res.json(create_result);
                                                console.log(create_result);
                                            }
                                        }
                                    );
                                }
                                else {
                                    //bookmark에 최초 등록
                                    db.pool.query('INSERT INTO TB_BOOKMARK(BOOK_FAVORITE,BOOK_URL,BOOK_NAME,BOOK_THUMB) VALUES(:book_favorite,:book_url,:book_name,:book_thumb)',
                                        {
                                            book_favorite: req.book_favorite,
                                            book_url: req.book_url,
                                            book_name: req.book_name,
                                            book_thumb: req.book_thumb
                                        },
                                        function (err, result) {
                                            if (err) { //error 諛쒖깮
                                                var create_result = {
                                                    success: 0,
                                                    result: {
                                                        message: err
                                                    }
                                                }
                                                res.send(create_result);
                                                console.log(err);
                                            }
                                            else { //error ?놁쓣 ??
                                                //bookmark 테이블 저장 후 comment 테이블에 댓글 저장
                                                db.pool.query('INSERT INTO TB_COMMENT(BOOK_INDEX,COM_COMMENT,COM_PROS,USER_NO,REGISTER_DATE)' +
                                                    ' VALUES((select book_index from TB_BOOKMARK where book_url=:book_url and book_favorite=:book_favorite),:com_comment,:com_pros,(SELECT USER_NO FROM TB_USER where USER_EMAIL=:user_email),sysdate())',
                                                    {
                                                        book_url:req.book_url,
                                                        book_favorite:req.book_favorite,
                                                        com_comment:req.com_comment,
                                                        com_pros:req.com_pros,
                                                        user_email:req.user_email
                                                    },function(err,result2){
                                                        if(err){
                                                            var create_result = {
                                                                success: 0,
                                                                result: {
                                                                    message: err
                                                                }
                                                            }
                                                            res.json(create_result);
                                                            console.log(create_result);
                                                        }
                                                        else{
                                                            console.log("succcessssssssssssss");
                                                            console.log(result2);
                                                            var create_result={
                                                                success:1,
                                                                result:{
                                                                    message:"게시판 등록 완료"
                                                                }
                                                            }

                                                            res.json(create_result); //寃곌낵 媛??꾩넚
                                                            console.log(create_result);
                                                        }
                                                    }
                                                );

                                            } //if end
                                        } //function end
                                    );
                                }
                            }
                        });
                }
            }
        });

}

router.post('/', function (req, res, next) {
    console.log("receive post!!");

    req.user_email = req.body.user_email; //?ъ슜??email ?꾩뿉 session?쇰줈 諛쏆븘??
    req.book_favorite = req.body.book_favorite; // 痍⑦뼢 //null
    url = req.body.book_url; // 스트링 작업을 위해 따로 저장
    req.book_url = req.body.book_url; //遺곷쭏??url
    thumbName = ((url.replace("http://", "")).replace("https://","")).replace(/[\/:*?"<>|]/g,"") + '.png'
    //req.book_name = req.body.book_name; //遺곷쭏???대쫫
    
    req.com_comment =  req.body.com_comment; // ?볤?
    req.com_pros = req.body.com_pros; //?볤? 醫뗭븘???섎튌??

    req.book_favorite = encode.decode(req.book_favorite);
    req.com_comment = encode.decode(req.com_comment);
    
    // 타이틀, 썸네임 가져오는 작업
    async.series([task1, task2], function(err, results) {
        if( err ) {
            console.log('Error : ', err);
            var create_result = {
                 success: 0,
                 result: {
                      message: err
                 }
            }
            res.json(create_result);
            return;
        }
        console.log('타이틀, 썸네일 가져오기 완료! ', results)
        
        req.book_name = title;
        req.book_thumb = 'images/thumbs/' + thumbName; // 저장된 썸네일 주소


        if (req.book_favorite === undefined) { //null 泥섎━
            req.book_favorite = "";
        }
        if (req.book_thumb === undefined) { //null 泥섎━
            req.book_thumb = "";
        }

        next();
        console.log("success post!!")
    });

    
}, sign_up_post);

function task1(callback) { // title 및 썸네일 저장 작업
    driver.create({ path: require('phantom').path }, function (err, browser) {
        browser.createPage(function (err, page) {
            page.open(url, function (err,status) {
                console.log("opened site? ", status);
                page.render(dir + thumbName);
                page.evaluate(function () {
                    return document.title;
                }, function (err,result) {
                    title = result;
                    browser.exit();
                    callback(null, 'task1 end');
                });
            });
        });
    });
}

function task2(callback) { // 썸네일 이미지 크기 조정 작업
    //console.log("render 완료 : " + dir + thumbName);
    gm(dir + thumbName)
    .resize('400', '300', '^')
    .gravity('North')
    .crop('400', '300')
    .write(dir + thumbName, function(err) {
        if(err) {
            console.error('Error : ' + err);
        }
        if(!err) {
            console.log('resize completed : ' + dir + thumbName);
            callback(null, 'task2 end');
        }
    });
}

module.exports = router;
