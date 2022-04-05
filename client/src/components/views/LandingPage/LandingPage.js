import React, { useEffect, useState, } from 'react'
import axios from 'axios'
import { withRouter, } from 'react-router-dom'
import { Box, Grid, Card, Typography, CardMedia, CardContent, Link, Avatar,
    CardHeader, } 
from '@material-ui/core'
import video from 'ffmpeg/lib/video';
import moment from 'moment'
import { height } from '@mui/system';




function LandingPage(props) {

    //비디오 변수
    const [video, setVideo] = useState([])

    useEffect(() => {
        
        axios.get('/api/video/getVideo')
            .then(res => {
                if (res.data.success) {
                    setVideo(res.data.videos)
                } else {
                    alert('비디오 가져오기 실패')
                }
            })
    }, [])

    //비디오 렌더링
    const renderVideo = video.map((video, index) => {
        let minutes = Math.floor(video.duration / 60)
        let seconds = Math.floor((video.duration - minutes * 60))
        return (
            // Grid item xs전체사이즈 
            <Grid item xs={12} sm={6} md={4} lg={3} key={index} >
                <Card sx={1} >
                    <a href={`/video/${video._id}`} color="inherit">
                        {/* <CardMedia
                            component="img"
                            height="180"
                            image={`http://localhost:5000/${video.thumbnail}`}
                            alt="이미지없음"
                        /> */}
                        <div style={{position: 'relative'}}>
                            <img style={{width: '100%',}} src={`http://localhost:5000/${video.thumbnail}`}/>
                            <div className='duration'>
                                <span>{minutes} : {seconds}</span>
                            </div>
                        </div>
                    </a>
                    <CardHeader 
                        avatar={
                            <Avatar aria-label="recipe">R</Avatar>
                        }
                        title={video.title}
                        subheader={video.writer.lastname + video.writer.firstname}
                    />
                    <span> 조회수 : {video.views} / 업로드 : {moment(video.createdAt).format('yyyy-MM-DD')}</span>
                </Card>
            </Grid>
        )
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Typography variant='h2' style={{ borderBottom: '1px solid' }}>V I D E O</Typography>

            <Grid container spacing={3} style={{ marginTop: '1vh' }}>
            {renderVideo}
            </Grid>
        </div>
    )
}

export default withRouter(LandingPage)


