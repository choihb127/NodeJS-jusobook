//index.js

var express=require('express');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var methodOverride=require('method-override');
var app=express();

//DB setting
mongoose.connect(process.env.MONGO_DB); // process.env => 환경변수가지는 객체. MONGO_DB => 내가 설정한 DB connection string (환경변수에 저장한거)
// mongoose.connect('connection string') 형태로 몽고DB 불러오기
var db=mongoose.connection; // mongoose의 object 를 변수 db에 연결

db.once('open',function(){ // DB 연결은 한번만 실행되므로 한번만 실행되는 once 함수 사용
    console.log('DB connected');
});

db.on('error',function(err){ // error는 언제든 발생할 수 있으므로 on 함수 사용
    console.log('DB ERROR : ',err);
});

app.set('view engine','ejs'); //ejs set
app.use(express.static(__dirname+'/public')); // '현재위치+/public' 을 static 폴더로 지정

//bodyParser 사용을 위한 코드
app.use(bodyParser.json()); // json 형식의 데이터를 받기
app.use(bodyParser.urlencoded({extended:true})); // urlencoded data를 extended 알고리즘으로 분석

app.use(methodOverride('_method')); // _method 의 query로 들어오는 값으로 HTTP메소드 변경

/* 이하 주석코드 모두 routes/Contact.js
//DB schema
var contactSchema=mongoose.Schema({ // 스키마설정 => DB에 저장할 구조 설정
    name:{type:String, required:true, unique:true}, // name의 타입: string, required=필수, unique=중복X
    email:{type:String}, // email의 타입: string
    phone:{type:String} // phone의 타입: string
});
var Contact=mongoose.model('contact',contactSchema); // contactSchema 모델 생성. 형태: model(콜렉션의 이름, Schema오브젝트)
*/

/* 이하 주석코드 모두 routes/contacts.js로 이동됨
//routes
//home
app.get('/',function(req,res){ // '/' 경로에 get 요청경우
    res.redirect('/contacts'); // '/contacts' 경로로 리다이렉트
});

//contacts - index
app.get('/contacts',function(req,res){ // '/contacts' 경로로 get요청경우
    Contact.find({},function(err,index_contacts){ // 형태: 모델.find(검색조건, 콜백함수) . 검색조건에 맞는 모델의 데이터를 찾고 콜백함수 호출하는 함수. 조건에 맞는 결과 모두찾아 전달. 검색조건 공백시 모든결과 return
        if(err) return res.json(err); // err발생시 에러내용 json형태로 표시
        res.render('contacts/index',{contacts:index_contacts}); // contacts/index render => /views/contacts/index.ejs 를 render
    }); // contacts:index_contacts => find콜백함수의 index_contacts를 contacts/index에 contacts라는 이름으로 전달
}); // 해당 내용 모두 routes/contacts.js 파일로 이동됨.

//contacts - new
app.get('/contacts/new',function(req,res){ // '/contacts/new' 경로로 get요청경우
    res.render('contacts/new'); // contacts/new render => /views/contacts/new.ejs 를 render
}); // 해당 내용 모두 routes/contacts.js 파일로 이동됨.

//contacts - create
app.post('/contacts',function(req,res){ // '/contacts' 경로로 post요청경우
    Contact.create(req.body,function(err,connect){ // 형태: 모델.create(생성할 데이터, 콜백함수) . DB에 데이터 생성하는 함수. 
        if(err) return res.json(err); // err발생시 에러내용 json형태로 표시
        res.redirect('/contacts'); // '/contacts' 경로로 리다이렉트
    });
}); // 해당 내용 모두 routes/contacts.js 파일로 이동됨.

//contacts - show 
app.get('/contacts/:id',function(req,res){ // 'contacts/:id' 경로로 get요청경우, ':'(콜론) 의 의미=> 콜론 위치에 오는 값을 받아 아래 req.params에 넣음 
    Contact.findOne({_id:req.params.id},function(err,show_contact){ // 형태: 모델.findOne(검색조건, 콜백함수) . find와 비슷하지만 조건에 맞는 결과 하나만 전달. 검색결과 없으면 null return
        if(err) return res.json(err); // err발생시 에러내용 json형태로 표시
        res.render('contacts/show',{contact:show_contact}); // contacts/show render => /views/contacts/show.ejs 를 render
    }); // contact:show_contact => findOne콜백함수의 show_contact를 contacts/show에 contact라는 이름으로 전달
}); // 해당 내용 모두 routes/contacts.js 파일로 이동됨.

//contacts - edit
app.get('/contacts/:id/edit',function(req,res){ // 'contacts/:id/edit' 경로로 get요청경우
    Contact.findOne({_id:req.params.id},function(err,edit_contact){ // findOne사용하여 검색
        if(err) return res.json(err); // err 발생시 
        res.render('contacts/edit',{contact:edit_contact}); // contact/edit render
    }); 
}); // 해당 내용 모두 routes/contacts.js 파일로 이동됨.

//contacts - update
app.put('/contacts/:id',function(req,res){ // 'contacts/:id' 경로로 put요청경우
    Contact.findOneAndUpdate({_id:req.params.id},req.body,function(err,contact){ // 형태: 모델.findOneAndUpdate(검색조건,업데이트정보,콜백함수) . 데이터를 찾고 수정. 콜백함수로 넘어가는 값은 수정 전 값
         // (업데이트 후 값 보내기는 콜백함수 구문전에 {new:true}추가)
        if(err) return res.json(err);
        res.redirect('/contacts/'+req.params.id); // 데이터 수정후 '/contacts/+req.params.id' 경로로 리다이렉트
    });
}); // 해당 내용 모두 routes/contacts.js 파일로 이동됨.

//contacts - destroy
app.delete('/contacts/:id',function(req,res){ // 'contacts/:id' 경로로 delete요청경우
    Contact.deleteOne({_id:req.params.id},function(err){ // 형태: 모델.(검색조건,콜백함수) . 검색조건에 맞는 데이터를 삭제
        if(err) return res.json(err);
        res.redirect('/contacts'); // 데이터 삭제후 '/contacts' 경로로 리다이렉트
    });
}); // 해당 내용 모두 routes/contacts.js 파일로 이동됨.

*/

//Routes
app.use('/',require('./routes/home')); // 'routes/homejs' 와 연결
app.use('/contacts',require('./routes/contacts')); // 'routes/contacts.js' 와 연결

//port setting
var port=3000;
app.listen(port,function(){
    console.log('server on! http://localhost:'+port);
}); // 3000번 포트에 연결
