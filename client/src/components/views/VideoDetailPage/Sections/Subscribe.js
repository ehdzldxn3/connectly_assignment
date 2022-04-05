import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useSelector } from "react-redux";

function Subcribe(props) {

    const [subscribeNumber, setSubscribeNumber] = useState(0)
    const [subscribed, setSubscribed] = useState(false)

    useEffect(() => {

        //구독자수 정보 
        let variable = { userTo: props.userTo }
        axios.post('/api/subscribe/subscribeNumber', variable)
            .then(res => {
                if (res.data.success) {
                    
                    setSubscribeNumber(res.data.subscribeNumber)
                } else {
                    alert('구독자수를 받아오지 못함')
                }
            })


        let subscribeVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId')}
        
        axios.post('/api/subscribe/subcribed', subscribeVariable)
            .then(res => {
                if (res.data.success) {    
                    setSubscribed(res.data.subscribed)     
                } else {
                    console.log('구독정보를 가져오지 못함')
                }
                
            }) 
            
    }, [])

    const onSubscribe = () => {
        
        let subcribeVariable = {
            userTo : props.userTo,
            userFrom : props.userFrom,
        }

        
        if(subscribed) {  //구독중이라면
            axios.post('/api/subscribe/unSubscribe', subcribeVariable)
                .then(res => {
                    if(res.data.success) {
                        setSubscribeNumber(subscribeNumber-1)
                        setSubscribed(!subscribed)
                    } else {
                        console.log('구독 취소를 실패 했습니다.')
                    }
                })
        } else {    //구독중이 아니라면
            axios.post('/api/subscribe/subscribe', subcribeVariable)
            .then(res => {
                if(res.data.success) {
                    setSubscribeNumber(subscribeNumber+1)
                    setSubscribed(!subscribed)
                } else {
                    console.log('구독 취소를 실패 했습니다.')
                }
            })
        }


    }

    return (
        <div>
            <button
                style={{
                    backgroundColor: `${subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius:'4px', color:'white', padding:'10px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'    }}
                onClick={onSubscribe}
            >
                {subscribeNumber} {subscribed ? '구독중' : '구독'}
            </button>

        </div>
    )
}

export default Subcribe
