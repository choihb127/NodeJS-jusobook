//index.js

var express=require('express');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var app=express();

//DB setting
mongoose.connect(process.env.MONGO_DB); // process.env => 환경변수가지는 객체. MONGO_DB => 내가 설정한 DB connection string (환경변수에 저장한거)
// mongoose.connect('connection string') 형태로 몽고DB 불러오기
var db=mongoose.connection; // mongoose의 object 를 변수 db에 연결

db.once('open',function(){ // DB 연결은 한번만 실행되므로 한번만 실행되는 once 함수 사용
    console.log('DB connected');
});

db.on('error',function(err){ //error는 언제든 발생할 수 있으므로 on 함수 사용
    console.log('DB ERROR : ',err);
});

app.set('view engine','ejs'); //ejs set
app.use(express.static(__dirname+'/public')); // '현재위치+/public' 을 static 폴더로 지정

// bodyParser 사용을 위한 코드
app.use(bodyParser.json()); //json 형식의 데이터를 받기
app.use(bodyParser.urlencoded({extended:true})); //urlencoded data를 extended 알고리즘으로 분석

//DB schema
var contactSchema=mongoose.Schema({ // 스키마설정 => DB에 저장할 구조 설정
    name:{type:String, required:true, unique:true}, // name의 타입: string, required=필수, unique=중복X
    email:{type:String}, // email의 타입: string
    phone:{type:String} // phone의 타입: string
});
var Contact=mongoose.model('contact',contactSchema); // contactSchema 모델 생성. 형태: model(콜렉션의 이름, Schema오브젝트)

// routes
// home
app.get('/',function(req,res){ // '/' 경로에 get 요청경우
    res.redirect('/contacts'); // '/contacts' 경로로 리다이렉트
});

//contacts - index
app.get('/contacts',function(req,res){ // '/contacts' 경로로 get요청경우
    Contact.find({},function(err,find_contacts){ // 형태: 모델.find(검색조건, 콜백함수) . 검색조건에 맞는 모델의 데이터를 찾고 콜백함수 호출하는 함수. 검색조건 공백시 모든결과 return
        if(err) return res.json(err); // err발생시 에러내용 json형태로 표시
        res.render('contacts/index',{contacts:find_contacts}); // contacts/index render => /views/contacts/index.ejs 를 render
    }); // contacts:contacts 형태??
});

// contacts - new
app.get('/contacts/new',function(req,res){ // '/contacts/new' 경로로 get요청경우
    res.render('contacts/new'); // contacts/new render => /views/contacts/new.ejs 를 render
});

// contacts - create
app.post('/contacts',function(req,res){ // '/contacts' 경로로 post 요청경우
    Contact.create(req.body,function(err,connect){ // 형태: 모델.create(생성할 데이터, 콜백함수) . DB에 데이터 생성하는 함수. 
        if(err) return res.json(err); // err발생시 에러내용 json형태로 표시
        res.redirect('/contacts'); // '/contacts' 경로로 리다이렉트
    });
});

// port setting
var port=3000;
app.listen(port,function(){
    console.log('server on! http://localhost:'+port);
}); // 3000번 포트에 연결