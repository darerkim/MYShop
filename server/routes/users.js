const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require('../models/Product');
const { Payment } = require('../models/Payment');
const { auth } = require("../middleware/auth");
const async = require('async');

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
    cart: req.user.cart,
    history: req.user.history
  });
});

router.post("/register", (req, res) => {

  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true
    });
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found"
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res
          .cookie("w_auth", user.token)
          .status(200)
          .json({
            loginSuccess: true, userId: user._id
          });
      });
    });
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true
    });
  });
});

router.post("/addToCart", auth, (req, res) => {
  console.log('addToCart 에 들어왔어욘');
  //먼저 user collection에 해당유저의 정보를 가져오기
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    //가져온 정보에서 cart에 넣으려하는 상품이 이미 있는지 확인
    let duplicate = false;
    userInfo.cart.forEach((item) => {
      if (item.id === req.body.productId) {
        duplicate = true;
      }
    })
    if (duplicate) {
      //상품이 이미 있을떄
      // item.quantity++;
      User.findOneAndUpdate(
        { _id: req.user._id, 'cart.id': req.body.productId }, 
        { $inc: { 'cart.$.quantity': 1 } }, 
        { new: true },
        (err, userInfo) => {
          if(err) return res.status(200).json({success:false,err});
          res.status(200).send(userInfo.cart);
        }
      )
    } else {
      //상품이 이미 있지 않을때
      User.findOneAndUpdate(
        {_id: req.user._id},
        {
          $push: {
            cart:{
              id: req.body.productId,
              quantity: 1,
              date: Date.now()
            }
          }
        },
        {new:true},
        (err, userInfo) => {
          if(err) return res.status(400).json({success:false, err});
          res.status(200).send(userInfo.cart);
        }
      )
    }
  })
});

router.get('/removeFromCart',auth,(req,res) => {
  //먼저 cart안에 내가 지우려한 상품을 지워주기
  User.findOneAndUpdate(
    {_id:req.user._id},
    {
      '$pull':
      {'cart':{'id':req.query.id}}
    },
    {new:true},
    (err,userInfo)=>{
      let cart = userInfo.cart;
      let array = cart.map(item => {
        return item.id;
      })
      //product collection 에서 현재 남아있는 상품들의 정보를 가져오기
      //productIds = ['sefsefsefsefsef','sgkjsefkjslefjlsejf'] 이런식으로 바꿔주기
      Product.find({_id:{$in:array}})
      .populate('writer')
      .exec((err,productInfo) => {
        return res.status(200).json({
          productInfo,
          cart
        })
      })
    }  
  )
})

router.post('/successBuy',auth,(req,res) => {
  //1.User Collection 안에 History 필드 안에 간단한 결제정보 넣어주기
  let history = [];
  let transactionData = {};
  req.body.cartDetail.forEach((item)=>{
    history.push({
      dateOfPurchase: Date.now(),
      name: item.title,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: req.body.paymentData.paymentId
    })
  })
  //2.Payment Collection 안에 자세한 결제정보들 넣어주기
  transactionData.user = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email
  }
  transactionData.data = req.body.paymentData;
  transactionData.product = history;
  //history 정보 저장
  User.findOneAndUpdate(
    {_id:req.user._id},
    {$push: {history: history}, $set: {cart:[]}},
    {new:true},
    (err, user) => {
      if(err) return res.json({success:false, err});
      //payment에다가 transactionData정보 저장
      const payment = new Payment(transactionData);
      payment.save((err, doc) => {
        console.log('%cusers.js line:181 doc', 'color: #007acc;', doc);
        if(err) return res.json({success:false, err});
        //3.Product Collection 안에 있는 sold 정보 업데이트 시켜주기
        //상품 당 몇개(quantity)를 샀는지
        let products = [];
        doc.product.forEach(item=>{
          products.push({id:item.id, quantity:item.quantity})
        })

        async.eachSeries(products,(item,callback) => {
          Product.update(
            {_id: item.id},
            {
              $inc: {
                'sold':item.quantity
              }
            },
            {new:false},
            callback
          )
        }, (err) => {
          if(err) return res.status(400).json({success:false,err});
          res.status(200).json({
            success:true,
            cart:user.cart,
            cartDetail:[]
          })
        }
        )
      })
    } 
  )
})

module.exports = router;
