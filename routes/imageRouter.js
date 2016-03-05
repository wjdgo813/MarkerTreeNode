var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/thumbs/:name', function(req, res, next){
    // sertup public directory where images are stored 
    var options = {
         root: __dirname + '/images/thumbs/',
         dotfiles: 'allow', // allow dot in file name
    };
    
    var fileName = req.params.name;
    // using res.sendFile from Express to send file to client
    res.sendFile(fileName, options, function (err) {
         if (err) {
              console.log(err);
              res.status(err.status).end();
         }else {
             console.log('Sent:', fileName);
        }
    });
})

module.exports = router;


