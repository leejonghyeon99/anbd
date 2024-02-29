import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { fetchWithToken } from './Reissue';

const PasswordCheck = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // 로컬 스토리지에서 JWT 토큰을 가져옵니다.
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        
        if (token) {
            // 토큰을 디코드하여 사용자 정보를 추출합니다.
            const decoded = jwtDecode(token);
            console.log(decoded); // 디코드된 토큰의 내용을 확인
            // 디코드된 정보에서 사용자 ID를 가져와 상태에 저장합니다.
            // 사용자 ID가 어떤 필드에 저장되어 있는지는 토큰 생성 방식에 따라 달라질 수 있습니다.
            setUsername(decoded.username || decoded.sub); // 'sub'는 JWT에서 일반적으로 사용자를 나타내는 필드입니다.
        }
    }, [token]);

    const inputPassword = (e) => {
        setPassword(e.target.value)
    };

    const confirmPassword = () => {

        const token = localStorage.getItem('accessToken');

        fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/user/passwordCheck`, { 
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.isValid) { // 비밀번호 일치 (서버에서 이를 isValid로 반환한다고 가정)
                navigate('/user/update');
            } else {
                alert('비밀번호가 일치하지 않습니다.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('비밀번호 검증 중 오류가 발생했습니다.');
        });

    }

    return (
        <div>
            <Form>비밀번호 확인</Form>
            <Form>id : {username}</Form>
           <Form>password : <input type='password' name='password' value={password} onChange={inputPassword}/></Form>
           <Button onClick={confirmPassword}>확인</Button>
        </div>
    );
};

export default PasswordCheck;