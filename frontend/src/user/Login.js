import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
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
          console.log("로그인성공"); /* 로그인됐는지 확인 좀 하겠습니다 */
          return response.json();
        }
        throw new Error("로그인 실패 : 아이디와 비밀번호를 확인해주세요.");
      })
      .then((data) => {
        localStorage.setItem('accessToken', data.accessToken);
        navigate("/home");
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
            <Link> <img src="/icon/Google.png" className="googleBtn"></img></Link>
            <Link> <img src="/icon/kakao.png" className="kakaoBtn"></img></Link>
            <Link> <img src="/icon/naver.png" className="naverBtn"></img></Link>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;

