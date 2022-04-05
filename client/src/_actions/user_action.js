import axios from "axios";
import {
    LOGIN_USER, SIGNUP_USER, AUTH_USER,
} from './types'


export function loginUser(dataToSubmit) {
    const req = axios.post('/api/user/login', dataToSubmit)
        .then(res =>  res.data)
    return {
        type : LOGIN_USER,
        payload : req
    }
}


export function signUp(dataToSubmit) {
    const req = axios.post('/api/user/signUp', dataToSubmit)
        .then(res =>  res.data)
    return {
        type : SIGNUP_USER,
        payload : req
    }    
}

export function auth() {
    const req =  axios.get('/api/user/auth')
        .then(res => res.data);
        return {
            type: AUTH_USER,
            payload: req
        }
}