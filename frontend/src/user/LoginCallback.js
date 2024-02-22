import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginCallback = () => {

    const navigate = useNavigate();

    useEffect(() => {
        // // URL에서 코드 추출 후 서버에 토큰 요청 로직 구현
        // const urlParams = new URLSearchParams(window.location.search);
        // const code = urlParams.get('code');
    

            // OAuth2 인증 성공 후 서버로부터 토큰 정보가 포함된 응답을 받을 URL에서 실행되어야 하는 로직
            fetch(`${process.env.REACT_APP_API_BASE_URL}/login/oauth2/code/google`,{
                credentials: 'include',
              })
          .then(response => response.json())
          .then(data => {
            localStorage.setItem('accessToken', data.accessToken); // 액세스 토큰 저장
            navigate('/home');
          })
          .catch(error => console.error('토큰 정보 처리 중 오류 발생', error));
          navigate('/login'); 
        
      }, [navigate]);

    return (
        <div>Loading...</div>
    );
};

export default LoginCallback;