var express = require('express');
var router = express.Router();

router.use('/',function (req, res, next) {
   const onTime = new Date()
   console.log(onTime)
   next()
 })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    say:'hi',
    no:'no~~',
  });
});

router.post('/test', function(req, res, next) {
console.log(req.body)
const test = req.body.test1
const test2= req.body.dfsdf
  res.json({
    result:test,
    result2: test2
  });
});

router.put('/test2', function(req, res, next) {
console.log('hi,im out method.')
console.log(req.body)
  res.json({
    result:req.body
  });
});

router.delete('/test3', function(req, res, next) {
console.log('hi,im out method.')
console.log(req.body)
  res.json({
    result:req.body,
    result2:"hi,im delete."
  });
});


module.exports = router;
