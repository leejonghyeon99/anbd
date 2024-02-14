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

    const formChange = (e) => {
        const {name, value} = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const validateUser = (e) => {
        e.preventDefault();

        const {repassword, ...signupdata} = user;

        if(user.password !== user.repassword){
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        fetch("http://localhost:8080/api/user/signup", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupdata),
        })
        .then(response => {
            if(response.ok){
                return response.json();
            } else {
                throw new Error("회원가입 실패")
            }
        })
        .then(data => {
            alert("회원가입 성공");
            navigate("/home")
        })
        .catch(Error => {
            alert(Error.message);
        });
    };


        return (
            <div>
                <Form>id : <input name = "username" value={user.username} onChange={formChange}/></Form>
                <Form>password : <input type='password' name = "password" value={user.password} onChange={formChange}/></Form>
                <Form>repassword : <input type='password' name = "repassword" value={user.repassword} onChange={formChange}/></Form>
                <Form>이름 : <input name = "name" value={user.name} onChange={formChange}/></Form>
                <Form>닉네임 : <input name = "nickname" value={user.nickname} onChange={formChange}/></Form>
                <Form>핸드폰번호 : <input name = "phone_number" value={user.phone_number} onChange={formChange}/></Form>
                <Form>email : <input name = "email" value={user.email} onChange={formChange}/><Button>이메일인증</Button></Form>
                <Form>주소 :<input name = "address" value={user.address} onChange={formChange}/></Form>
                <Button onClick={validateUser}>회원 가입</Button>
            </div>
        );
    };    
export default SignUp;