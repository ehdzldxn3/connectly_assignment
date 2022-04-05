//몽고디비
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subscriberSchema = mongoose.Schema({
    userTo:{    //작성자
        type: Schema.Types.ObjectId,    //몽고디비 오브젝트형 아이디로 저장
        ref: 'User',                    //user 모델에 있는 모든정보를 저장
    },

    userFrom : {
        type: Schema.Types.ObjectId,    //몽고디비 오브젝트형 아이디로 저장
        ref: 'User',  
    }

}, { timestamps: true })    //업로드 시간 생성한 시간 표시 된다!


//User라는 이름으로  스키마를 모델로 감싼다
const Subscriber = mongoose.model('Subscriber', subscriberSchema)

//밖에서도 쓰려고 하는 설정
module.exports = { Subscriber }