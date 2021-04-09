const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const {Product} = require('../models/Product');
const multer  = require('multer')


//=================================
//             Product
//=================================
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}_${file.originalname}`)
	}
})

var upload = multer({ storage: storage }).single('file')

router.post("/image", (req, res) => {
	//가져온 이미지를 저장을 해주면 된다.
  upload(req,res,err=>{
    if(err) return res.json({success:false,err});
    return res.json({success:true, filePath:res.req.file.path, fileName:res.req.file.filename});
  })
});

router.post("/", (req, res) => {
	// 받아온 정보들을 db에 넣어준다.
	const product = new Product(req.body);
	product.save((err)=>{
		if(err) return res.status(400).json({success:false,err});
		return res.status(200).json({success:true});
	})
});

router.post("/products", (req, res) => {
	// Product Collection에 들어있는 모든 상품을 찾아온다.
	let limit = req.body.limit ? parseInt(req.body.limit):20;
	let skip = req.body.skip ? parseInt(req.body.skip):0;

	Product.find()
	.populate('writer')
	.skip(skip)
	.limit(limit)
	.exec((err,productList)=>{
		if(err) return res.status(400).json({success:false, err});
		return res.status(200).json({success:true,productList,postSize:productList.length});
	})
});
module.exports = router;
