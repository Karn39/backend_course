// npm install firebase

// ref: https://firebase.google.com/docs/database/web/read-and-write

var express = require('express')
var router = express.Router()
const firebase = require('firebase')
var config = {
    databaseURL: "https://socoolproject-a45a5.firebaseio.com" // enter your databaseURL（輸入由firebase中申請到的firebase的databaseURL）
}
const uuidv4=require('uuid/v4')
var jwt=require('jsonwebtoken')
//取得現在時間，並將格式轉成YYYY-MM-DD HH:MM:SS
// const onTime = () => {
//     const date = new Date()
//     const mm = date.getMonth() + 1
//     const dd = date.getDate()
//     const hh = date.getHours()
//     const mi = date.getMinutes()
//     const ss = date.getSeconds()
//
//     return [date.getFullYear(), "-" +
//         (mm > 9 ? '' : '0') + mm, "-" +
//         (dd > 9 ? '' : '0') + dd, " " +
//         (hh > 9 ? '' : '0') + hh, ":" +
//         (mi > 9 ? '' : '0') + mi, ":" +
//         (ss > 9 ? '' : '0') + ss
//     ].join('')
// }

firebase.initializeApp(config)
// set middleware
router.use('/',function (req, res, next) {
    const onTime = new Date()
    console.log(onTime)
    next()
})
//取得全部資料
// ----------------產品-------------------
router.get('/get/all',function(req,res,next){
   // once->取得資料
    firebase.database().ref('products/').once('value', function (snapshot) {
        // console.log(snapshot.val())
        res.status(200).json({
          result: snapshot.val()
        })
    })
})

router.get('/get',function(req,res,next){
    const id=req.query.id
    if (id === undefined || id === '') {
        res.status(400).json({
            result: '請在request的輸入id的query值。'
        })
        // 若沒加該行return會造成一個重複給response中的錯誤
        return
    }
    firebase.database().ref('products/' + id).once('value', function (snapshot) {
        // console.log(snapshot.val())
        res.status(200).json({
            result: snapshot.val()
        })
    })
})

router.post('/post',function(req,res,next){
  // set -> 建立新的資料
  const name=req.body.name
  const price=req.body.price

  if(name === undefined || price === undefined ||
     name === null || price === null ||
     name === '' || price === '')
  {
    res.status(400).json({
      result:"請輸入name及price"
    })
    return
  }
  firebase.database().ref('products/' + uuidv4()).set({
   name: req.body.name,
   price: req.body.price
  })
  res.json({
    result:'完成產品登錄'
  })
})

  // + PUT - 更改產品（可選擇只修改產品名稱或只修改價格）
router.put('/put',function(req,res,next){
    //update->更新指定資料
    const id =req.body.id
    const name=req.body.name
    const price=req.body.price
    // 試著判斷前端在request中是否有正常的輸入request的key。
    if (id === undefined|| id === '') {
        res.status(400).json({
            result: '請在query中輸入id值。'
        })
        // 若沒加該行return會造成一個重複給response中的錯誤
        return
    }
    firebase.database().ref('products/'+id).update({
        name:name,
        price:price
      })
      res.json({
        result:'完成產品更新'
      })
  })

router.delete('/delete',function(req,res,next){
    //remove -> 刪除指定資料
    const id=req.body.id
    if (id === undefined|| id === '') {
        res.status(400).json({
            result: '請在query中輸入id值。'
        })
        // 若沒加該行return會造成一個重複給response中的錯誤
        return
    }
    firebase.database().ref('products/'+id).remove()
    res.json({
      result:'完成產品移除'
    })
  })

// -----------------會員-------------------
router.post('/register',function(req,res,next) {
    const account=req.body.account
    const password=req.body.password
    if(account===undefined||account===''
    ||password===undefined||password===''){
      res.status(400).json({
        result:'請輸入內容'
      })
      return
    }
      firebase.database().ref('members/' + uuidv4()).set({
         account: account,
         password: password
      })
         res.json({
           result:'完成會員註冊'
         })
  })

router.post('/signin',function(req,res,next){
    const account=req.body.account
    const password=req.body.password
    firebase.database().ref('members/').orderByChild('account').
    equalTo(account).on('value', function (snapshot) {
      if (snapshot.val() === null) {
          res.json({
              result: '無該帳號'
          })
          return
      }
      const token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (60 * 60),
          data: account
        }, 'secret')
      const decoded = jwt.verify(token, 'secret')
      res.json({
          token
      })
  })
})

// -----------------訂單-------------------
router.get('/list/all',function(req,res,next){
  firebase.database().ref('list/').once('value', function (snapshot) {
      // console.log(snapshot.val())
      res.status(200).json({
        result: snapshot.val()
      })
  })
})

router.get('/list',function(req,res,next){
    const token=req.query.token
    if (token === undefined || token === '') {
        res.status(400).json({
            result: '請在request的輸入id的query值。'
        })
        // 若沒加該行return會造成一個重複給response中的錯誤
        return
    }
    firebase.database().ref('list/'+id).once('value', function (snapshot) {
        // console.log(snapshot.val())
        res.status(200).json({
          result: snapshot.val()
        })
    })
})

router.post('/listadd',function(req,res,next){
  const name = req.body.name
  const quantity = req.body.quantity
  const token = req.query.token

  if(name === undefined || quantity === undefined || token === undefined ||
     name === '' || quantity === '' || token === '')
     {
       res.status(400).json({
         result:'請輸入完整'
       })
       return
     }
  const decoded = jwt.verify(token,'secret')
  const account = decoded.data

  firebase.database().ref('list/' + uuidv4()).set({
    account,
    name,
    quantity
  })
  res.json({
    result:'完成訂單追加'
  })
})
// -----------------訂單-------------------
module.exports = router
