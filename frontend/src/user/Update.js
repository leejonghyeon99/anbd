import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const Update = () => {

    const [userInfo, setUserInfo] = useState({
        password: '',
        repassword: '',
        name: '',
        nickname: '',
        phoneNumber: '',
        email: ''
    });

    useEffect(() => {
        // 사용자 정보 불러오기 (모의 데이터 사용, 실제로는 API 호출 결과를 사용해야 함)
        const fetchedUserInfo = {
            password: 'password123', // 비밀번호는 일반적으로 수정 폼에 미리 채워지지 않음
            repassword: '', // 비밀번호 확인 역시 수정 폼에 미리 채워지지 않음
            name: '홍길동',
            nickname: 'gilDong',
            phoneNumber: '010-1234-5678',
            email: 'gildong@example.com'
        };

        // 불러온 사용자 정보로 상태 업데이트
        setUserInfo(fetchedUserInfo);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // 정보 수정 요청을 보내는 함수 (예시)
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(userInfo);
        // 여기서 수정된 userInfo를 서버로 보내는 API 호출을 수행합니다.
    };

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