
const express = require('express')
const app = express()
const port = 5000


//쿠키
const cookieParser = require('cookie-parser')

//config에 있는 몽고디비 정보
const config = require('./config/key')
//몽고디비 연결
const mongoose = require('mongoose')
mongoose.connect (config.monggoURI)
.then( () => console.log('MongoDB Connected…'))
.catch(err => console.log(err))

//express 설정
//json 데이터 가져오기 설정
//express 4.0이상 부터는 body-parser 없이 데이터를 가져올수있다.
app.use(express.json());
//쿠기 사용하기위한 설정
app.use(cookieParser())
//서버에 있는 파일을 쓰기위한 설정 
// 'uploads'에 있는 파일을 /uploads 라는 경로로 접근 한다!
app.use('/uploads',express.static('uploads'));



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//test
app.get('/', (req, res) => {
  res.send('안녕?')
})

//user
app.use('/api/user', require('./routes/user'));

//video
app.use('/api/video', require('./routes/video'));

//구독
app.use('/api/subscribe', require('./routes/subscribe'));




