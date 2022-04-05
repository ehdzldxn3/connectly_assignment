//몽고디비
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const videoSchema = mongoose.Schema({
    writer:{    //작성자
        type: Schema.Types.ObjectId,    //몽고디비 오브젝트형 아이디로 저장
        ref: 'User',                    //user 모델에 있는 모든정보를 저장
    },
    title : {   //제목
        type:String,
        maxlength: 50,
    },
    description: {  //설명
        type: String,
    },
    setting: {  //보안
        type: Number,
    },
    filePath : {    //비디오경로
        type: String,
    },
    catogory: { //카테고리
        type: String,   
    },
    views : {   // 몇번본건지 확인
        type: Number,
        default: 0 
    },
    duration :{     //비디오 러닝타임
        type: String
    },
    thumbnail: {    //썸네일
        type: String
    }
}, { timestamps: true })    //업로드 시간 생성한 시간 표시 된다!


//User라는 이름으로  스키마를 모델로 감싼다
const Video = mongoose.model('Video', videoSchema)

//밖에서도 쓰려고 하는 설정
module.exports = { Video }