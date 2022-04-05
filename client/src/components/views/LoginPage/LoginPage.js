import React, { useState, } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom'


function LoginPage(props) {

    const dispatch = useDispatch()
    
    const [Id, setId] = useState("")
    const [Password, setPassword] = useState("")

    
    const onIdHandler = (e) => {
        setId(e.currentTarget.value)            
    }

    const onPasswordHandler = (e) => {
        setPassword(e.currentTarget.value)
    }

    const onSubmitHandler = (e) => {
        //onSubmit 새로고침 막는 이벤트
        e.preventDefault();
        //서버에 보낼 데이터
        let body = {
            id : Id,
            password : Password
        }
        //액션
        dispatch(loginUser(body))
            .then(response => {
                if( response.payload.loginSuccess ){
                    localStorage.setItem('userId', response.payload.userId)
                    props.history.push('/')
                    
                } else {
                    console.log('에러')
                }
            })

    }


    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height:'100vh'
        }}>
            <form style={{display: 'flex', flexDirection: 'column'}}
                onSubmit={onSubmitHandler}>
                <label>ID</label>
                <input type="text" value={Id} onChange={onIdHandler}/>
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>
                <br/>
                <button>Login</button>
            </form>
        </div>
    )
}
export default withRouter(LoginPage)

 
