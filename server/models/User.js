//몽고디비
const mongoose = require('mongoose')
//암호화
const bcrypt = require('bcrypt');
const saltRounds = 10;

//토큰
const jwt =require('jsonwebtoken')



const userSchema = mongoose.Schema({
    
    firstname: {
        type: String,
        maxlength: 50,
    },

    id: {
        type: String,
        trim: true,
        unique: 1,     
    },

    password: {
        type: String,
        minlength: 5,
    },

    lastname: {
        type: String,
        maxlength: 50,
    },

    role: {
        type: Number,
        default: 0,
    },

    image: String,

    token: {
        type: String
    },
    
    tokenExp: {
        type: Number
    }
})


// 암호화
userSchema.pre('save', function (next)  {
    var user = this;
    if(user.isModified('password')){
        //비밀번호를 암호화 시킨다
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

// 비밀번호 암호화 맞는지 확인 하는 메소드
userSchema.methods.comparePW = function (pw, cb)  {
    //비밀번호가 맞는지 확인하기 
    //* 가져온 비밀번호를 암호화 시켜서 맞는지 확인하는것
    bcrypt.compare(pw, this.password, function (err, isMatch){
        // console.log(pw)
        // console.log(this.password)
        if(err) return cb(err);
        cb(null, isMatch)
    })
}


//토큰생성
userSchema.methods.generateToken = function (cb)  {
    var user = this
    
    //jsonWebToken을 이용해서 토큰을 생선한다
    var token = jwt.sign(user._id.toString(), 'secret')
    
    user.token = token

    //몽고DB에 token을 저장하면서 user을 리턴시킨다.
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this
    jwt.verify(token, 'secret', function (err, decoded) {
        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err)
            cb(null, user)
        })
    })
}

//User라는 이름으로  스키마를 모델로 감싼다
const User = mongoose.model('User', userSchema)

//밖에서도 쓰려고 하는 설정
module.exports = {User}