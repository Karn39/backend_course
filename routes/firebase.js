// npm install firebase

// ref: https://firebase.google.com/docs/database/web/read-and-write

var express = require('express');
var router = express.Router();
const firebase = require('firebase')
var config = {
    databaseURL: "https://socoolproject-a45a5.firebaseio.com" // enter your databaseURL（輸入由firebase中申請到的firebase的databaseURL）
};
firebase.initializeApp(config);
// set middleware
router.use('/',function (req, res, next) {
    const onTime = new Date()
    console.log(onTime)
    next()
  })

router.get('/getdata',function(req,res,next){
   // once->取得資料
    firebase.database().ref('users/').once('value', function (snapshot) {
        console.log(snapshot.val());
        res.status(206).json({
          result: snapshot.val()
        })
    });
})

  router.post('/postdata',function(req,res,next){
  // set -> 建立新的資料
  firebase.database().ref('users/' + '124').set({
     username: req.body.username,
     email: req.body.email
    });
     res.json({
       result:'complete'
     })
  });

  router.put('/putdata',function(req,res,next){
  //update->更新指定資料
  firebase.database().ref('users/'+'223').update({
      username: req.body.username,
      emali: req.body.email
    })
    res.json({
      result:'already covered'
    })
  })

  router.delete('/deletedata',function(req,res,next){
    //remove -> 刪除指定資料
    firebase.database().ref('users/'+'124').remove();
    res.json({
      result:'already removed'
    })
  })

module.exports = router;
