import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./CSS/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    setUser({
      ...user,
    });
  }, []);

  const InputValue = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const submitLogin = (e) => {
    e.preventDefault(); // 폼 기본 제출 동작 방지

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.ok) {
          console.log("로그인 성공");
          return response.json();
        } else {
          throw new Error("로그인 실패 : 아이디와 비밀번호를 확인해주세요.");
        }
      })
      .then((data) => {
        localStorage.setItem("accessToken", data.accessToken);

        // 사용자 정보 가져오기 없이 직접 토큰으로 디코딩하여 사용자 정보를 추출
        const decodedToken = atob(data.accessToken.split(".")[1]);
        const userInfo = JSON.parse(decodedToken);

        // 사용자 정보 업데이트
        setUser(userInfo);

        // 홈 화면으로 이동
        navigate("/home");

        // // 페이지 새로고침
        window.location.reload();
      })
      .catch((error) => {
        alert(error.message);
        setUser({
          username: "",
          password: "",
        });
      });
  };

  return (
    <>
      <div className="loginMain">
        <div className="loginLogo">A N B D</div>
        <div className="loginBox">
          <Form onSubmit={submitLogin}>
            <div className="idBox">
              <label htmlFor="username">ID </label>
              <input
                type="text"
                className="form-control"
                value={user.username}
                placeholder="아이디를 입력하세요"
                name="username"
                id="username"
                onChange={(e) => InputValue(e)}
              />
            </div>

            <div className="passwordBox">
              <label htmlFor="password"> PASSWORD </label>
              <input
                type="password"
                className="form-control"
                value={user.password}
                placeholder="비밀번호를 입력하세요"
                name="password"
                id="password"
                onChange={(e) => InputValue(e)}
              />
            </div>
            <Button type="submit">Login</Button>
            <div className="oauthLoginBtn">
              {/* <a href={`${process.env.REACT_APP_API_BASE_URL}/oauth2/authorization/google`}>
              <img
                src="/icon/Google.png"
                alt="Google login"
                className="googleBtn"
              />
              </a>

              <a href={`${process.env.REACT_APP_API_BASE_URL}/oauth2/authorization/kakao`}>
              <img
                src="/icon/kakao.png"
                alt="Kakao login"
                className="kakaoBtn"
              />
              </a>

              <a href={`${process.env.REACT_APP_API_BASE_URL}/oauth2/authorization/naver`}>
              <img
                src="/icon/naver.png"
                alt="Naver login"
                className="naverBtn"
              />
              </a> */}

            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
