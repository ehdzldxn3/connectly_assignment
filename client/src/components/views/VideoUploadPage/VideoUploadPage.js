import React, {useState, useCallback, } from 'react'
import { withRouter } from 'react-router-dom'
import { Container, Typography, TextField, Box, Select, MenuItem, InputLabel, FormControl, Button,
    Dialog, DialogTitle
    } from "@material-ui/core";
import { useStyles, } from '../Styles/VideoUploadStyles'
import Dropzone from 'react-dropzone'
import { AddPhotoAlternate, AddAPhoto  } from '@mui/icons-material';
import axios from "axios";
import { useSelector } from "react-redux";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';






function VideoUploadPage(props) {

    const user = useSelector(state => state.user)
    const [title, setTitle] = useState('')  //제목
    const [description, setDescription] = useState('')  //설명
    const [setting, setSetting] = useState('')    //보안
    const [catogory, setCatogory] = useState('')    //카테고리
    const [filePath, setFilePath] = useState('')    //비디오 경로
    const [duration, setDuration] = useState(0)    //비디오 러닝타임
    const [thumbnailPath, setThumbnailPath] = useState('')  //썸네일 경로
    const [thumbnailCheck, setThumbnailCheck]  = useState(false) //비디오 업로드체크용
    const [videoCheck, setVideoCheck]  = useState(false) //썸네일 확인 체크용
    const [open, setOpen] = useState(false);    //팝업창 보여지고 안보여지고
    




    //CSS
    const classes = useStyles();

    const titleChange = (e) => {    //제목 체인지 이벤트
        setTitle(e.target.value)
    }

    const descriptionChange = (e) => {  //설명 체인지 이벤트
        setDescription(e.target.value)
    }

    const settingChange = (e) => {  //보안 체인지 이벤트
        setSetting(e.target.value)
    }

    const catogoryChange = (e) => {
        setCatogory(e.target.value)
    }

    const videoOnSubmit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id,
            title: title,
            description: description,
            setting: setting,
            filePath: filePath, 
            catogory: catogory,
            duration: duration,     
            thumbnail: thumbnailPath,    
        }

        axios.post('/api/video/uploadVideo', variables)
            .then(res => {
                if(res.data.success) {
                    setOpen(true)
                    props.history.push('/')
                    setOpen(false)
                } else {
                    alert('비디오 업로드 실패')
                }
            })
    }

    const onDrop = (files) => {
        let formData = new FormData();

        // axios header에  멀티파트라 적어줘야 파일을 인식한다
        //https://darrengwon.tistory.com/560 
        //참고해서 노션작성하기
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        
        formData.append("file", files[0])
                
        axios.post('/api/video/uploadfiles', formData, config)
        .then(res => {
            if(res.data.success) {
                
                let varivale = {
                    filePath : res.data.filePath,
                    fileName: res.data.fileName
                }
                //비디오경로 & 비디오 업로드 체크 
                setFilePath(res.data.filePath)
                setVideoCheck(res.data.success)
    
                axios.post('/api/video/thumbnail', varivale)
                    .then(res => {
                        if(res.data.success) {
                            //듀레이션 & 썸네일 경로 & 업로드 체크저장
                            setDuration(res.data.fileDuration)
                            setThumbnailPath(res.data.thumbsFilePath)
                            setThumbnailCheck(res.data.success)
                        } else {
                            alert("썸네일 실패")
                        }
                        
                    })

            } else {
                alert("실패")
            }
        })
    }


    //팝업창
    function SimpleDialog(props) {
        const { open, } = props;
        return (
            <Dialog open={open}>
                <Alert severity="success">
                    <AlertTitle>업로드 성공</AlertTitle>
                    <strong>업로드 성공 하였습니다.</strong>
                </Alert>
            </Dialog>
        );
      }  

      
    return (
        <div >
            <SimpleDialog open={open}/>
            <Container fixed style={{ verticalAlign:'middle'}}>
            <Typography align='center' component='div' variant="h3" color='primary'>Video Upload</Typography>
                <form onSubmit={videoOnSubmit}>
                    <div style={{ display:'flex', justifyContent:'space-between', paddingTop:'2vh'}}>
                        {/* 드랍존 */}
                        <Dropzone
                            onDrop={onDrop}
                            multiple={false}
                            maxSize={80000000000}>
                            {({ getRootProps, getInputProps }) => (
                                <div style={{
                                    width: '50vh', height: '30vh', border: '4px solid lightgray', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center'
                                }} {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <AddAPhoto sx={{ fontSize: 100 }} />
                                </div>
                            )}
                        </Dropzone>
                        {/* 썸네일 */}
                        {thumbnailCheck === false ?
                        //썸네일이 올라오면 화면이 보여지다
                            <div style={{
                                width: '50vh', height: '30vh', border: '4px solid lightgray', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <AddPhotoAlternate sx={{ fontSize: 100 }} />
                            </div>
                            :
                            //썸네일이 생기면 이미지 보여짐
                            <div style={{
                                width: '50vh', height: '30vh', border: '4px solid lightgray', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <img src={`http://localhost:5000/${thumbnailPath}`}
                                    style={{
                                        
                                        width: '48vh', height: '28vh',
                                        objectFit: 'cover'
                                    }} />
                                    
                            </div>
                        }
                    </div>
                    <br/>
                    <br/>
                    {/* 제목 */}
                    <TextField  
                        className={classes.title}
                        id="title" 
                        label="제목" 
                        variant="standard" 
                        value={title} 
                        onChange={titleChange}/>
                    <br/>
                    <br/>
                    {/* 설명 */}
                    <TextField 
                    id="description" 
                    label="설명" 
                    variant="standard" 
                    fullWidth value={description} 
                    onChange={descriptionChange}
                    />
                    <br/>
                    <br/>
                    {/* 보안설정 */}
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="setting_Label">보안설정</InputLabel>
                        <Select
                            labelId="setting_Label"
                            id="setting"
                            value={setting||''}
                            onChange={settingChange}
                            style={{ width: '60vh' }}
                            label="Setting"
                        >
                            {/* 0은 기본값 */}
                            <MenuItem value={0}><em>None</em></MenuItem>   
                            <MenuItem value={1}>Private</MenuItem>
                            <MenuItem value={2}>Public</MenuItem>
                        </Select>
                    </FormControl>
                    <br/>
                    <br/>
                    {/* 카테고리 */}
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="catogory_Label" >카테고리</InputLabel>
                        <Select
                            labelId="catogory_Label"
                            id="catogory"
                            value={catogory||''}
                            onChange={catogoryChange}
                            style={{ width: '60vh' }}
                            label="Catogory"
                        >
                            <MenuItem value={0}><em>None</em></MenuItem>
                            <MenuItem value={1}>Film & Animation</MenuItem>
                            <MenuItem value={2}>Autos & Vehicles</MenuItem>
                            <MenuItem value={3}>Music</MenuItem>
                            <MenuItem value={4}>Pets & Animals</MenuItem>
                            <MenuItem value={5}>Sports</MenuItem>
                        </Select>
                    </FormControl>
                    <br/>
                    <br/>
                    <Box align='center' style={{paddingTop:'2vh'}}>
                        <Button 
                            variant="contained"
                            color='primary'
                            style={{
                                width: '25vh', height: '5vh', fontSize: '5vh',
                            }}
                            type='onSubmit'
                            >
                            S A V E
                        </Button>
                    </Box>
                </form>
            </Container>
        </div>
    )
}

export default withRouter(VideoUploadPage)
