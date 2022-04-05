const express = require('express');
const router = express.Router();
//user
const { User } = require('../models/User')
//auth 미들웨어
const { auth } = require('../middleware/auth');



//회원가입
router.post('/signUp', (req, res) => {
  //회원가입 필요한 정보 가져와서 DB에 저장한다
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, error:err})
    return res.status(200).json({
      success: true
    })
  })
})

//Login
router.post('/login', (req, res) => {
  //요청된 email DB 찾는다.
  User.findOne({ id: req.body.id }, (err, user) => {    
    if (!user) {
      return res.json({
        loginSuccess: false,
        msg: '존재하지 않는 계정입니다.'
      })
    }
    //요청된 이메일이 DB에 있다면 비밀번호가 맞는지 확인
    user.comparePW(req.body.password, function (err, isMatch) {
      if (!isMatch) return res.json({ loginSuccess: false, message: '비밀번호가 틀렸습니다.' })
      //비밀번호까지 맞다면 토큰을 생성한다.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err)
        //user데이터를 x_auth라는 이름의 쿠키로 내보낸다. 
        //저장한다. 로컬스토리지 / 쿠키 / 세션
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })

  })
})

//Auth
router.get('/auth', auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 이야기
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

//Logout
router.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id },
    { token: "" },
    (err, user) => {
      if (err) return res.json({ success: false, err })
      return res.status(200).send({
        success: true
      })
    })
})

module.exports = router;