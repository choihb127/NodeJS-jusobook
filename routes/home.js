//routes/home.js

var express=require('express');
var router=express.Router(); // express.Router() 로 router 함수 초기화

//Home
router.get('/',function(req,res){ // '/' 에 get 요청오는경우 => 이전에 app.get과 동일한것
    res.redirect('/contacts'); // '/contacts' 로 리다이렉트
});

module.exports=router; // router 변수를 model로 만듬. require 로 불러오기 가능