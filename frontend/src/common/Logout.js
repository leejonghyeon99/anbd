import React from 'react';
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from '../user/Reissue';
import "./CSS/Mypagebar.css";

// 로그아웃 기능을 로그아웃.js 밖에서 불러서 실행
export const handleLogout = (navigate) => {

    const token = localStorage.getItem("accessToken");

    fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/user/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=utf-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // 서버로부터의 응답을 JSON으로 파싱
        } else {
          throw new Error("로그아웃 실패");
        }
      })
      .then((data) => {
        console.log("로그아웃 성공", data.message);
        localStorage.removeItem("accessToken");
        // 페이지 새로고침
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        console.error(error); // 오류 처리
      });
}

const Logout = () => {
    
    const navigate = useNavigate();
    

      return (
        <div className='logoutBox'>
        <img
          src="/icon/logout.png"
          onClick={() => handleLogout(navigate)}
          className='logout'
          alt="Logout"
        />
        </div>
      );
  };

  

export default Logout;