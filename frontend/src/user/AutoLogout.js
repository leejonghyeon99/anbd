import { useEffect } from 'react';
import { handleLogout } from './Logout'; // 올바른 경로를 사용하여 import
import { useNavigate } from 'react-router-dom';

const AUTO_LOGOUT_TIME = 1000 * 60 * 60; // 1시간

// 자동 로그아웃 기능
export const useAutoLogout = () => {

    const navigate = useNavigate(); // 페이지 리다이렉트를 위해 useNavigate를 호출

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // 토큰이 없으면(비로그인 상태) 아무것도 하지 않음
      return;
    }

    const handleActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    const checkActivity = () => {
      const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0', 10); // 문자열 타임스탬프 시간을 10진수로 변환해서 저장
      const now = Date.now(); // 현재 시간을 타임스탬프로 저장
      if (now - lastActivity > AUTO_LOGOUT_TIME) {
        console.log('자동 로그아웃 처리');
        handleLogout(navigate); // 로그아웃 기능 실행
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    // 매 10초마다 반복적으로 실행하도록 설정
    const intervalId = setInterval(checkActivity, 10000);
    

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      clearInterval(intervalId);
    };
  }, []);
};
