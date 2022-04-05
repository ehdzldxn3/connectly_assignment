import React, { useEffect } from 'react';
import { auth } from '../_actions/user_action';
import { useDispatch } from "react-redux";


export default function (SpecificComponent, option, adminRoute = null) {
    function AuthenticationCheck(props) {

        const dispatch = useDispatch();
        useEffect(() => {
            dispatch(auth())
            .then(res => {
                //option true 로그인상태
                //option false 로그인하지 않은 상태
                //adminRoute true
                
                //로그인 하지 않은 상태 
                if (!res.payload.isAuth) {
                    if (option) {
                        props.history.push('/login')
                    }
                } else {
                    //로그인 한 상태 
                    if (adminRoute && !res.payload.isAdmin) {
                        props.history.push('/')
                    } else {
                        if (option === false)
                            props.history.push('/')
                    }
                }
            })

        }, [])

        return (
            <SpecificComponent/>
        )
    }
    return AuthenticationCheck
}