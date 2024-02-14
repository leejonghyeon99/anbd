import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PasswordCheck = () => {

    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const inputPassword = (e) => {
        setPassword(e.target.value)
    };

    const confirmPassword = () => {

        // fetch('/api/user/', { // 가정된 API 엔드포인트
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         // 필요한 경우, 인증 토큰을 헤더에 추가
        //     },
        //     body: JSON.stringify({ password }) // 사용자가 입력한 비밀번호를 JSON 형태로 서버에 전송
        // })
        // .then(response => response.json())
        // .then(data => {
        //     if (data.isValid) { // 비밀번호 일치 (서버에서 이를 isValid로 반환한다고 가정)
        //         navigate('/update-page'); // 비밀번호가 일치하면 업데이트 페이지로 이동
        //     } else {
        //         alert('비밀번호가 일치하지 않습니다.'); // 비밀번호 불일치
        //     }
        // })
        // .catch(error => {
        //     console.error('Error:', error);
        //     alert('비밀번호 검증 중 오류가 발생했습니다.');
        // });

    }

    return (
        <div>
            <Form>비밀번호 확인</Form>
           <Form>password : <input type='password' name='password' value={password} onChange={inputPassword}/></Form>
           <Button onClick={confirmPassword}>확인</Button>
        </div>
    );
};

export default PasswordCheck;