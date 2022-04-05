const express = require('express');
const router = express.Router();
//video



//썸넹일 만드는거 참고해서 노션작성
//https://lts0606.tistory.com/510
const ffmpeg = require('fluent-ffmpeg')


//파일저장 
//multer를 불러오고 이용해서 저장하자
const multer = require('multer');
const { Video } = require('../models/Video');

//multer 설정
const storage = multer.diskStorage({
    //파일저장할 경로
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    //파일이름
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    //파일 확장자명 결정하기 mp4만 받겠다
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
})
//파일업로드 미들웨어 설정
const upload = multer({storage}).single('file')

//비디오 업로드
router.post('/uploadfiles', (req, res) => {
    
    upload(req, res, err => {
        
        if(err){
            return res.json({success:false, err})
        }
        return res.json({ 
            success: true, //비디오 업로드 성공
            filePath: res.req.file.path, //비디오 경로
            fileName: res.req.file.filename //비디오 이름
        })
    })
})


//비디오 썸네일 생성
router.post('/thumbnail', (req, res) => {
    let thumbsFilePath ="";
    let fileDuration ="";
    //윈도우에서만 경로 설정해야함 ㅠㅠ
    ffmpeg.setFfmpegPath('C:\\Program Files\\ffmpeg-4.4.1-full_build\\bin\\ffmpeg.exe');

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
        fileDuration = metadata.format.duration;
    })

    //썸네일 생성
    //경로및 저장 위치 
    ffmpeg(req.body.filePath)
    .on('filenames', function(filenames) {
        thumbsFilePath = "uploads/thumbnails/" + filenames[0];
    })
    //썸네일 생성 끝나고 할일
    .on('end', function() {
        return res.json({ 
            success: true, 
            thumbsFilePath: thumbsFilePath, //썸네일 경로
            fileDuration: fileDuration, //비디오의 러닝타임
        })
    })
    .on('error', function (err) {
        return res.json({ success: false, err: err})
    })
    //생성하기
    .screenshots({
        // Will take screens at 20%, 40%, 60% and 80% of the video
        count: 1,   //3개의 썸네일을 만든다
        folder: 'uploads/thumbnails',   
        size:'500x300', //크기
        // %b input basename ( filename w/o extension )
        filename:'thumbnail-%b.png'
    });

})

//비디오 정보 저장
router.post('/uploadVideo', (req, res) => {
    const video = new Video(req.body)
    video.save((err, doc) => {
        if(err) return res.json({success: false, err})
        res.status(200).json({success:true})
    }) 
})

//비디오 가져오기
router.get('/getVideo', (req, res) => {
    
    //모든 비디오를 가져와서 프론트에 보낸다.
    Video.find()
    .populate('writer') //writer은 스키마 오브젝트 아이디 타입으로 했기때문에 이걸 설정해준다 안하면 writer만 가져옴
    .exec( (err, videos) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, videos})
    })

})

//비디오 디테일 가져오기
router.post('/getVideoDetail', (req, res) => {
    Video.findOne({ "_id": req.body.videoId})
        .populate('writer') 
        .exec((err, videoDetail) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({success: true, videoDetail})
        })
})



module.exports = router;