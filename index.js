//index.js

var express=require('express');
var mongoose=require('mongoose');
var app=express();

//DB setting
mongoose.connect(process.env.MONGO_DB); // process.env => 환경변수가지는 객체. MONGO_DB => 내가 설정한 DB connection string (환경변수에 저장한거)
// mongoose.connect('connection string') 형태로 몽고DB 불러오기
var db=mongoose.connection; // mongoose의 object 를 변수 db에 연결

db.once('open',function(){ //DB 연결은 한번만 실행되므로 한번만 실행되는 once 함수 사용
    console.log('DB connected');
});

db.on('error',function(err){ //error는 언제든 발생할 수 있으므로 on 함수 사용
    console.log('DB ERROR : ',err);
});

app.set('view engine','ejs'); //ejs set
app.use(express.static(__dirname+'/public')); // '현재위치+/public' 을 static 폴더로 지정

var port=3000;
app.listen(port,function(){
    console.log('server on! http://localhost:'+port);
}); // 3000번 포트에 연결