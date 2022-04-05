import React, { useEffect, useState, } from 'react'
import axios from 'axios'
import { height } from '@mui/system'

function SideVideo() {

    //비디오 변수
    const [sideVideo, setSideVideo] = useState([])

    useEffect(() => {
        
        axios.get('/api/video/getVideo')
            .then(res => {
                if (res.data.success) {
                    setSideVideo(res.data.videos)
                } else {
                    alert('비디오 가져오기 실패')
                }
            })
    }, [])

    const renderSideVideo = sideVideo.map((video, index) => {
        let minutes = Math.floor(video.duration / 60)
        let seconds = Math.floor((video.duration - minutes * 60))
        return (
            <div key={index} style={{display:'flex', marginBottom: '1rem', padding: '0.2rem'}}>
                <div style={{width: '40%', marginRight: '1rem'}}>
                    <a href={`/video/${video._id}`}>
                        <img style={{width:'100%', height:'100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt='asdf'/>
                    </a>
                </div>

                <div style={{width:'50%'}}>
                    <a href={`/video/${video._id}`} style={{color:'gray'}}>
                        <span style={{fontSize:'1rem', color:'black'}}>{video.title}</span><br/>
                        <span>작성자 : {video.writer.lastname}{video.writer.firstname} </span><br/>
                        <span>조회수 : {video.views}</span><br/>
                        <span>{minutes} : {seconds}</span>
                    </a>
                </div>
            </div>
        )
    })

    return (
        <React.Fragment>
            <div style={{marginTop:'3rem'}}>
                {renderSideVideo}
            </div>
        </React.Fragment>
    )
}

export default SideVideo
