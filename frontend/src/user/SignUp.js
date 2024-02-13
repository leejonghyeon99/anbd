import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {

        

        return (
            <div>
                <Form>id : <input/></Form>
                <Form>password : <input type='password'/></Form>
                <Form>repassword : <input type='password'/></Form>
                <Form>이름 : <input/></Form>
                <Form>닉네임 : <input/></Form>
                <Form>핸드폰번호 : <input/></Form>
                <Form>email : <input/></Form>
                <Form>주소 :</Form>
                <Button>회원 가입</Button>
            </div>
        );
    ç

};

export default SignUp;