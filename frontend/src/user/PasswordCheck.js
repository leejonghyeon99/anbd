import React from 'react';
import { Button, Form } from 'react-bootstrap';

const PasswordCheck = () => {
    return (
        <div>
            <Form>비밀번호 확인</Form>
           <Form>password : <input type='password'/></Form>
           <Button>확인</Button>
        </div>
    );
};

export default PasswordCheck;