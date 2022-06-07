//models/Contact.js

var mongoose=require('mongoose');

//DB schema
var contactSchema=mongoose.Schema({ // 스키마설정 => DB에 저장할 구조 설정
    name:{type:String, required:true, unique:true}, // name의 타입: string, required=필수, unique=중복X
    email:{type:String}, // email의 타입: string
    phone:{type:String} // phone의 타입: string
}); // index.js에서 이동된 코드.

var Contact=mongoose.model('contact',contactSchema); // contactSchema 모델 생성. 형태: model(콜렉션의 이름, Schema오브젝트)

module.exports=Contact;