import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Update = () => {

    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        password: '',
        repassword: '',
        name: '',
        nickname: '',
        phone_number: '',
        email: '',
        regions:'',
    });

    // 토큰으로 유저 정보 불러오기
    useEffect(() => {
        const token = localStorage.getItem('accessToken'); 

    if (token) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/info`, {
            headers: {
                Authorization: `Bearer ${token}` // JWT를 Authorization 헤더에 추가
            }
        })
                .then(response => response.json())
                .then(data => setUserInfo(data))
                .catch(error => console.error("userinfo error", error));
        }
    }, []);

    useEffect(() => {
            console.log(userInfo)
    },[userInfo])

    // 변경되는 유저 정보값 받아오기
    function infoChange(e){
        const {name, value} = e.target;
        setUserInfo(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    }

    // 유저 정보 수정하기
    function updateUser() {
        const token = localStorage.getItem('accessToken'); 
        if (token) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/update`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(userInfo),
            })
            .then(response => {
                if (response.ok) {
                    alert("회원정보 수정완료");
                    return response.json();
                } else {
                    return Promise.reject("회원정보 수정에 실패했습니다.");
                }
            })
            .then(data => {
                console.log(data);
                setUserInfo(data); // 응답 데이터로 상태 업데이트
                navigate("/home");
            })
            .catch(error => {
                console.error("회원정보 수정오류", error);
                alert(error);
            });
        }
    }
    return (
        <div>
            <Form>password : <input type='password' name='password' onChange={infoChange}/></Form>
            <Form>repassword : <input type='password'name='repassword' onChange={infoChange}/></Form>
            <Form>이름 : <input name='name' value={userInfo.name} onChange={infoChange}/></Form>
            <Form>닉네임 : <input name='nickname' value={userInfo.nickname} onChange={infoChange}/></Form>
            <Form>핸드폰번호 : <input name='phone_number' value={userInfo.phone_number} onChange={infoChange}/></Form>
            <Form>email : <input name='email' value={userInfo.email} onChange={infoChange}/></Form>
            <Form>주소 : <input name='regions' value={userInfo.regions} onChange={infoChange}/></Form>
            <Button onClick={updateUser}>회원 수정</Button>
        </div>
    );
};

export default Update;