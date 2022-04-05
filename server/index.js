

const express = require('express')
const app = express()
const port = 5000
const KAKAO_OAUTH_TOKEN_API_URL = "https://kauth.kakao.com/oauth/token"
const KAKAO_GRANT_TYPE="authorization_code"
const KAKAO_CLIENT_id="6da5fdd529f686d8caa4bfc0b436cf14"
const KAKAO_REDIRECT_URL="http://localhost:5000/kakao/code"
const axios = require('axios');

app.use(express.json());

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

//test
app.get('/api/hello', (req, res) => {
    res.send('Hello World!')
  })


app.get('/kakao/code', function (req, res, next) {
        let code = req.query.code;
        try{
            axios.post(
                `${KAKAO_OAUTH_TOKEN_API_URL}?grant_type=${KAKAO_GRANT_TYPE}&client_id=${KAKAO_CLIENT_id}&redirect_uri=${KAKAO_REDIRECT_URL}&code=${code}`
                , {
                 headers: {
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).then((result)=>{
                res.send('KAKAO 토큰 : ' + result.data['access_token'])
            }).catch(e=> {
                console.log(e)
                res.send(e);
            })
        }catch(e){
            console.log(e)
            res.send(e);
        }
})

app.get('/test', function (req,res) {
    res.send('asdf')
}) 