import React from "react";
import { useNavigate } from "react-router";

const Logout = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 얻어옴

  const handleLogout = () => {
    const token = localStorage.getItem("accessToken");
    console.log(token);

    if (!token) {
      console.log("No token found, user is probably not logged in");
      // 추가 처리: 사용자가 이미 로그아웃 상태임을 알림 or 로그인 페이지로 리디렉션
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/logout`, {
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
        window.location.reload();
        navigate("/");
      })
      .catch((error) => {
        console.error(error); // 오류 처리
      });
  };
  return <>{handleLogout()}</>;
};

export default Logout;
