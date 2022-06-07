//routes/contact.js

var express=require('express');
var router=express.Router();
var Contact=require('../models/Contact'); // 'models/Contact' 의 Contact module require 호출

//Index
router.get('/',function(req,res){ // '/contacts' 경로로 get요청경우
    Contact.find({},function(err,index_contacts){ // 형태: 모델.find(검색조건, 콜백함수) . 검색조건에 맞는 모델의 데이터를 찾고 콜백함수 호출하는 함수. 조건에 맞는 결과 모두찾아 전달. 검색조건 공백시 모든결과 return
        if(err) return res.json(err); // err발생시 에러내용 json형태로 표시
        res.render('contacts/index',{contacts:index_contacts}); // contacts/index render => /views/contacts/index.ejs 를 render
    }); // contacts:index_contacts => find콜백함수의 index_contacts를 contacts/index에 contacts라는 이름으로 전달
}); // 이전에 index.js에 있던 contact--index와 동일한것. app에서 router로 변수명 변경됨. 요청경로 '/contacts' 생략됨.

//New
router.get('/new',function(req,res){ // '/contacts/new' 경로로 get요청경우
    res.render('contacts/new'); // contacts/new render => /views/contacts/new.ejs 를 render
}); // 이전에 index.js에 있던 contact--new와 동일한것. app에서 router로 변수명 변경됨. 요청경로 '/contacts' 생략됨.

//Create
router.post('/',function(req,res){ // '/contacts' 경로로 post요청경우
    Contact.create(req.body,function(err,connect){ // 형태: 모델.create(생성할 데이터, 콜백함수) . DB에 데이터 생성하는 함수. 
        if(err) return res.json(err); // err발생시 에러내용 json형태로 표시
        res.redirect('/contacts'); // '/contacts' 경로로 리다이렉트
    });
}); // 이전에 index.js에 있던 contact--create와 동일한것. app에서 router로 변수명 변경됨. 요청경로 '/contacts' 생략됨.

//Show 
router.get('/:id',function(req,res){ // 'contacts/:id' 경로로 get요청경우, ':'(콜론) 의 의미=> 콜론 위치에 오는 값을 받아 아래 req.params에 넣음 
    Contact.findOne({_id:req.params.id},function(err,show_contact){ // 형태: 모델.findOne(검색조건, 콜백함수) . find와 비슷하지만 조건에 맞는 결과 하나만 전달. 검색결과 없으면 null return
        if(err) return res.json(err); // err발생시 에러내용 json형태로 표시
        res.render('contacts/show',{contact:show_contact}); // contacts/show render => /views/contacts/show.ejs 를 render
    }); // contact:show_contact => findOne콜백함수의 show_contact를 contacts/show에 contact라는 이름으로 전달
}); // 이전에 index.js에 있던 contact--show와 동일한것. app에서 router로 변수명 변경됨. 요청경로 '/contacts' 생략됨.

//Edit
router.get('/:id/edit',function(req,res){ // 'contacts/:id/edit' 경로로 get요청경우
    Contact.findOne({_id:req.params.id},function(err,edit_contact){ // findOne사용하여 검색
        if(err) return res.json(err); // err 발생시 
        res.render('contacts/edit',{contact:edit_contact}); // contact/edit render
    }); 
}); // 이전에 index.js에 있던 contact--edit와 동일한것. app에서 router로 변수명 변경됨. 요청경로 '/contacts' 생략됨.

// Update
router.put('/:id',function(req,res){ // 'contacts/:id' 경로로 put요청경우
    Contact.findOneAndUpdate({_id:req.params.id},req.body,function(err,contact){ // 형태: 모델.findOneAndUpdate(검색조건,업데이트정보,콜백함수) . 데이터를 찾고 수정. 콜백함수로 넘어가는 값은 수정 전 값
         // (업데이트 후 값 보내기는 콜백함수 구문전에 {new:true}추가)
        if(err) return res.json(err);
        res.redirect('/contacts/'+req.params.id); // 데이터 수정후 '/contacts/+req.params.id' 경로로 리다이렉트
    });
}); // 이전에 index.js에 있던 contact--update와 동일한것. app에서 router로 변수명 변경됨. 요청경로 '/contacts' 생략됨.

//Destroy
router.delete('/:id',function(req,res){ // 'contacts/:id' 경로로 delete요청경우
    Contact.deleteOne({_id:req.params.id},function(err){ // 형태: 모델.(검색조건,콜백함수) . 검색조건에 맞는 데이터를 삭제
        if(err) return res.json(err);
        res.redirect('/contacts'); // 데이터 삭제후 '/contacts' 경로로 리다이렉트
    });
}); // 이전에 index.js에 있던 contact--destroy와 동일한것. app에서 router로 변수명 변경됨. 요청경로 '/contacts' 생략됨.

module.exports=router; // router 변수를 model로 만듬. require 로 불러오기 가능