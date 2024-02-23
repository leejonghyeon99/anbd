import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./CSS/SignUp.css";
import regionsData from "../api/regionsData.json";

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
    region: "",
  });

  //유효성 검사를 위한 State함수들
  const [usernameErr, setUsernameErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [nicknameErr, setNicknameErr] = useState(false);
  const [phoneErr, setPhoneErr] = useState(false);
  const [emailErr, setEmailErr] = useState(null);
  const [regError, setRegError] = useState(false);

  // 인증번호 입력란 가시성 상태 변수
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);
  // 인증번호 상태 변수
  const [verificationCode, setVerificationCode] = useState("");

  // user의 상태값이 변경될때마다 호출! cosole 확인
  useEffect(() => {
    console.log("User 정보가 변경되었습니다:", user);
  }, [user]);

  // onChange에 적용될 formChange
  const formChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  //유효성 검사
  const validateForm = () => {

  // 각 필드별 에러 상태 초기화
  setUsernameErr(false);
  setPasswordErr(false);
  setNameErr(false);
  setNicknameErr(false);
  setPhoneErr(false);
  setEmailErr(false);
  setRegError(false);

  let isValid = true;

  // 사용자명 유효성 검사 (예: 최소 4자 이상)
  if (user.username.trim().length < 4) {
    setUsernameErr(true);
    isValid = false;
  }

  // 비밀번호 유효성 검사 (예: 최소 4자, 숫자 포함)
  if (user.password.trim().length < 4 || !/\d/.test(user.password)) {
    setPasswordErr(true);
    isValid = false;
  }

  // 이름 유효성 검사 (예: 비어 있지 않음)
  if (user.name.trim().length === 0) {
    setNameErr(true);
    isValid = false;
  }

  // 닉네임 유효성 검사 (예: 비어 있지 않음)
  if (user.nickname.trim().length === 0) {
    setNicknameErr(true);
    isValid = false;
  }

  // 전화번호 유효성 검사 (예: 숫자만, 10~11자)
  if (!/^\d{10,11}$/.test(user.phone_number)) {
    setPhoneErr(true);
    isValid = false;
  }

  // 이메일 유효성 검사 (예: 이메일 형식)
  if (user.email.trim() === '') {
    setEmailErr("empty");
  } else if (!/\S+@\S+\.\S+/.test(user.email)) {
    setEmailErr("format");
  } else {
    setEmailErr(null);
  }

  // 지역 선택 유효성 검사 (예: 선택됨)
  if (user.region === "") {
    setRegError(true);
    isValid = false;
  }

  return isValid;
  };
  
  // join버튼을 누르면 submit되는 동작
  const submitJoin = (e) => {
    e.preventDefault();
    const { repassword, ...signupdata } = user;

    if(validateForm()) {

    if (user.password !== user.repassword) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    console.log(signupdata);
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
          return null;
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
  };

  // 이메일인증 버튼 클릭
  const validateEmail = () => {
    // 이메일이 비어 있는지 확인
    if (user.email.trim() === '') {
      setEmailErr("empty");
      setIsVerificationVisible(false); // 이메일이 비어있을 때는 인증번호 입력란 숨김
      return; // 에러가 발생하면 여기서 함수 실행을 중단
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      setEmailErr("format");
      setIsVerificationVisible(false); // 이메일 형식이 맞지 않을 때는 인증번호 입력란 숨김
      return; // 에러가 발생하면 여기서 함수 실행을 중단
    } else {
      setEmailErr(null); // 에러가 없으면 에러 상태를 null로 설정
    }
  
    // 이메일 유효성 검사를 통과했을 경우에만 인증번호 입력란을 보여줌
    setIsVerificationVisible(true);
  };

  // 인증번호 입력 핸들러 함수
  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  return (
    <div className="signUpMain">
      <div className="joinTitle">
        <h1>JOIN US</h1>
      </div>
      <Form onSubmit={submitJoin}>
        {/* 아이디 입력란 */}
        <div>
          <label htmlFor="username">
            ID <small>* </small>
          </label>
          <input
            type="text"
            placeholder="ID를 입력하세요"
            name="username"
            value={user.username}
            onChange={formChange}
          />
          
        </div>
        {usernameErr && (
          <div>
            <small className="text-danger">ID은 4자리 이상 입력해주세요.</small>
          </div>
        )}

        <div>
          {/* 비밀번호 입력란 */}
          <label htmlFor="password">
            비밀번호 <small>(필수)</small>
          </label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            name="password"
            value={user.password}
            onChange={formChange}
          />
        </div>
        {passwordErr && (
          <div>
            <small className="text-danger">비밀번호는 4자리 이상, 숫자가 포함되어야 합니다.</small>
          </div>
        )}
        <div>
          {/* 비밀번호 확인 입력란 */}
          <label htmlFor="repassword">
            비밀번호 확인 <small>* </small>
          </label>
          <input
            type="password"
            placeholder="비밀번호를 한 번 더 입력하세요"
            name="repassword"
            value={user.repassword}
            onChange={formChange}
          />
        
        </div>
        {passwordErr && (
          <div>
            <small className="text-danger">비밀번호가 일치하지 않습니다.</small>
          </div>
        )}
        <div>
          {/* 이름 입력란 */}
          <label htmlFor="name">
            이름 <small>* </small>
          </label>
          <input
            name="name"
            placeholder="이름을 입력하세요"
            value={user.name}
            onChange={formChange}
          />
        </div>
        {nameErr && (
          <div>
            <small className="text-danger">이름은 필수입니다</small>
          </div>
        )}
        <div>
          {/* 닉네임 입력란 */}
          <label htmlFor="nickname">
            닉네임 <small>* </small>
          </label>
          <input
            name="nickname"
            placeholder="닉네임을 입력하세요"
            value={user.nickname}
            onChange={formChange}
          />
        </div>
        {nicknameErr && (
          <div>
            <small className="text-danger">닉네임은 필수입니다</small>
          </div>
        )}
        <div>
          {/* 연락처 입력란 */}
          <label htmlFor="phone_number">
            연락처 <small>* </small>
          </label>
          <input
            name="phone_number"
            placeholder="연락처를 입력하세요"
            value={user.phone_number}
            onChange={formChange}
          />
        </div>
        {phoneErr && (
          <div>
            <small className="text-danger">연락처는 필수입니다</small>
          </div>
        )}
        <div>
          {/* 이메일 입력란 */}
          <label htmlFor="email">
            이메일 <small>* </small>
          </label>
          <input
            name="email"
            placeholder="이메일을 입력하세요"
            value={user.email}
            onChange={formChange}
          />
          <Button
            onClick={validateEmail}
            variant="light"
            size="sm"
            className="rounded"
          >
            이메일 인증
          </Button>
        </div>
        {emailErr === "empty" && (
    <div>
      <small className="text-danger">이메일은 필수입니다.</small>
    </div>
  )}
  {emailErr === "format" && (
    <div>
      <small className="text-danger">이메일 양식에 맞춰서 입력해주세요.</small>
    </div>
  )}
        {/* 인증번호 입력란 */}
        {isVerificationVisible && (
          <div>
            <label htmlFor="verificationCode">
              인증번호 <small>* </small>
            </label>
            <input
              type="text"
              placeholder="인증번호를 입력하세요"
              name="verificationCode"
              value={verificationCode}
              onChange={handleVerificationCodeChange}
            />{" "}
            {/* onClick 수정해야함*/}
            <Button onClick={validateEmail} variant="light" size="sm">
              인증번호 확인
            </Button>
          </div>
        )}
        <div>
          {/* 주소 입력란 */}
          <label htmlFor="region">
            주소 <small>* (최대 3개) </small>
          </label>

          {/*
        regionsData.features.map()을 사용하여 JSON 파일의 "SIG_KOR_NM"을 옵션으로 동적으로 추가합니다.
      */}
          <select
            className="form-select"
            name="region"
            onChange={formChange}
            value={user.region}
          >
            <option value="" disabled>
              -- 거주지역을 선택해 주세요 --
            </option>

            {/* 거주지역 select option을 regionsData에서 map으로 가져온다. */}
            {regionsData.features.map((feature) => (
              <option
                key={feature.properties.SIG_CD}
                value={feature.properties.SIG_KOR_NM}
              >
                {feature.properties.SIG_KOR_NM}
              </option>
            ))}
          </select>
        </div>
        {regError && (
          <div>
            <small className="text-danger">거주지역을 선택해주세요</small>
          </div>
        )}
        <Button type="submit">Join</Button>
      </Form>
    </div>
  );
};
export default SignUp;
