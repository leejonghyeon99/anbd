import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const validateLogin = (e) => {
        e.preventDefault(); // 폼 기본 제출 동작 방지
    
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/login`, {
            method : "POST",
            headers : {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                username,
                password,
            }),
        })
        .then(Response => {
            if(Response.ok){
                return Response.json();
            }
          throw new Error("로그인 실패 : 아이디와 비밀번호를 확인해주세요.");
        })
        .then(Data => {
            localStorage.setItem('accessToken', Data.token);
            navigate("/home");
        })
        .catch(error => {
            alert(error.message);
            setUsername('');
            setPassword('');
        });
    };

    return (
        <Form>
            <Form>id : <input value = {username} onChange={(e) => setUsername(e.target.value)}/></Form>
            <Form>password : <input type='password' value = {password} onChange={(e) => setPassword(e.target.value)}/></Form>
            <Button onClick={validateLogin}>Login</Button>
        </Form>
    );
};

export default Login;