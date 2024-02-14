import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        username : '',
        password : '',
        repassword : '',
        name : '',
        nickname : '',
        phone_number : '',
        email : '',
        address : '',  

    });

    // const validateUser = (e) => {
    //     e.preventDefault(); // 폼 기본 제출 동작 방지
    
    //     fetch('http://localhost:8080/api/user/signup', {
    //         method : "POST",
    //         headers : {
    //             'Content-Type': 'application/json',
    //         },
    //         body : JSON.stringify({
    //             username,
    //             password : '',
    //             repassword : '',
    //             name : '',
    //             nickname : '',
    //             phone_number : '',
    //             email : '',
    //             address : '',  
    //         }),
    //     })
    //     .then(Response => {
    //         if(Response.ok){
    //             return Response.json();
    //         }
    //       throw new Error("회원가입 실패");
    //     })
    //     .then(Data => {
    //         localStorage.setItem('token', Data.token);
    //         navigate("/home");
    //     })
    //     .catch(error => {
    //         alert(error.message);
    //     });
    // };


        return (
            <div>
                <Form>id : <input/></Form>
                <Form>password : <input type='password'/></Form>
                <Form>repassword : <input type='password'/></Form>
                <Form>이름 : <input/></Form>
                <Form>닉네임 : <input/></Form>
                <Form>핸드폰번호 : <input/></Form>
                <Form>email : <input/><Button>이메일인증</Button></Form>
                <Form>주소 :<input/></Form>
                <Button onClick={validateUser}>회원 가입</Button>
            </div>
        );
    

};

export default SignUp;