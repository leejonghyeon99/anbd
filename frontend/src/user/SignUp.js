import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./CSS/SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    password: "",
    repassword: "",
    name: "",
    nickname: "",
    phone_number: "",
    email: "",
    address: "",
  });

  const [adr, setAdr] = useState([]);
  const [usernameErr, setUsernameErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [rerswdErr, setRepswdErr] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [nicknameErr, setNicknameErr] = useState(false);
  const [phoneErr, setPhoneErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [adrError, setAdrError] = useState(false);

  useEffect(() => {
    setUser({
      ...user,
      address: adr.toString(),
    });
  }, [adr]);

  const formChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const submitJoin = (e) => {
    e.preventDefault();

    const { repassword, ...signupdata } = user;

    if (user.password !== user.repassword) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(signupdata),
    })
      .then((response) => {
        if (response.ok) {
          console.log("회원가입");
          return response.json();
        } else {
          throw new Error("회원가입 실패");
        }
      })
      .then((data) => {
        alert("회원가입 성공");
        navigate("/home");
      })
      .catch((Error) => {
        alert(Error.message);
      });
  };

  const validateEmail = () => {};

  const handleAddressChange = (e) => {
    const addressArray = e.target.value.split(",");
    setAdr(addressArray);
  };

  return (
    <div>
      <div className="joinTitle">
        <h1>JOIN US</h1>
      </div>
      <Form onSubmit={submitJoin}>
        <div>
          <label htmlFor="username">
            ID<small>* </small>
          </label>
          <input
            type="text"
            placeholder="ID를 입력하세요"
            name="username"
            value={user.username}
            onChange={formChange}
          />
        </div>
        <div>
          <label htmlFor="password">
            비밀번호<small>(필수)</small>
          </label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            name="password"
            value={user.password}
            onChange={formChange}
          />
        </div>
        <div>
          <label htmlFor="repassword">
            비밀번호 확인<small>* </small>
          </label>
          <input
            type="password"
            placeholder="비밀번호를 한 번 더 입력하세요"
            name="repassword"
            value={user.repassword}
            onChange={formChange}
          />
        </div>
        <div>
          <label htmlFor="name">
            이름<small>* </small>
          </label>
          <input
            name="name"
            placeholder="이름을 입력하세요"
            value={user.name}
            nChange={formChange}
          />
        </div>
        <div>
          <label htmlFor="nickname">
            닉네임<small>* </small>
          </label>
          <input
            name="nickname"
            placeholder="닉네임을 입력하세요"
            value={user.nickname}
            onChange={formChange}
          />
        </div>
        <div>
          <label htmlFor="phone_number">
            연락처<small>* </small>
          </label>
          <input
            name="phone_number"
            placeholder="연락처를 입력하세요"
            value={user.phone_number}
            onChange={formChange}
          />
        </div>
        <div>
          <label htmlFor="email">
            이메일<small>* </small>
          </label>
          <input
            name="email"
            placeholder="이메일을 입력하세요"
            value={user.email}
            onChange={formChange}
          />
          <Button onClick={validateEmail}>이메일 인증</Button>
        </div>
        <div>
          <label htmlFor="address">
            주소<small>* </small>
          </label>
          <input
            name="address"
            placeholder="주소를 입력하세요"
            value={user.address}
            onChange={handleAddressChange}
            style={{
              width: "80%",
              fontSize: "10px",
              padding: "5px", // 패딩을 8px로 설정
            }}
          />
        </div>
        <Button type="submit">Join</Button>
      </Form>
    </div>
  );
};
export default SignUp;
