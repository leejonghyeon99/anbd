import React from 'react';
import { Button, Form } from 'react-bootstrap';

const Update = () => {
    return (
        <div>
            <Form>password : <input type='password'/></Form>
            <Form>repassword : <input type='password'/></Form>
            <Form>이름 : <input/></Form>
            <Form>닉네임 : <input/></Form>
            <Form>핸드폰번호 : <input/></Form>
            <Form>email : <input/></Form>
            <Button>회원 수정</Button>
        </div>
    );
};

export default Update;