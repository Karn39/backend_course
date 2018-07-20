// npm install firebase

// ref: https://firebase.google.com/docs/database/web/read-and-write

var express = require('express');
var router = express.Router();
const firebase = require('firebase')
var config = {
    databaseURL: "https://socoolproject-a45a5.firebaseio.com" // enter your databaseURL（輸入由firebase中申請到的firebase的databaseURL）
};
const uuidv4=require('uuid/v4');

firebase.initializeApp(config);
// set middleware
router.use('/',function (req, res, next) {
    const onTime = new Date()
    console.log(onTime)
    next()
  })

router.get('/getdata',function(req,res,next){
   // once->取得資料
    firebase.database().ref('Product/').once('value', function (snapshot) {
        console.log(snapshot.val());
        res.status(206).json({
          result: snapshot.val()
        })
    });
})

  router.post('/postdata',function(req,res,next){
  // set -> 建立新的資料
  firebase.database().ref('Product/' + uuidv4()).set({
     Product: req.body.Product,
     Price: req.body.Price
    });
     res.json({
       result:'完成產品登錄'
     })
  });

  router.put('/putdata',function(req,res,next){
  //update->更新指定資料
  firebase.database().ref('Product/'+uuidv4()).update({
      Product: req.body.Product,
      Price: req.body.Price
    })
    res.json({
      result:'完成產品更新'
    })
  })

  router.delete('/deletedata',function(req,res,next){
    //remove -> 刪除指定資料
    firebase.database().ref('Product/'+req.body.id).remove();
    res.json({
      result:'完成產品移除'
    })
  })

module.exports = router;
