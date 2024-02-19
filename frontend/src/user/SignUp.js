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
    regions: [],
  });

  const [regs, setRegs] = useState([]);
  const [usernameErr, setUsernameErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [rerswdErr, setRepswdErr] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [nicknameErr, setNicknameErr] = useState(false);
  const [phoneErr, setPhoneErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [adrError, setAdrError] = useState(false);

  // 인증번호 입력란 가시성 상태 변수
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);
  // 인증번호 상태 변수
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    setUser({
      ...user,
      regions: regs.toString(),
    });
  }, [regs]);

  const formChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const addRegions = ((newRegions) => { // 필요한지 확인
    setUser(user => ({
      ...user,
      regions: [...user.regions, newRegions],
    }));
  })


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

  // const handleRegionsChange = (e) => {
  //   const regionsArray = e.target.value.split(",");
  //   setRegs(regionsArray);
  // };

  const validateEmail = () => {
    // 이메일이 비어 있는지 확인
    if (user.email.trim() === "") {
      alert("이메일을 입력하세요.");
      return;
    }
    // 이메일 검증 코드 추가
    // 이메일 검증이 성공하면 인증번호 입력란을 보여줍니다.
    setIsVerificationVisible(true);
  };

  // 인증번호 입력 핸들러 함수
  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  // 주소 다중 선택 ---> 수정중!!
  const handleRegionsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);

    // 선택된 옵션의 개수를 확인하고, 최대 3개까지만 선택되도록
    if (selectedOptions.length <= 3) {
      setUser((prevUser) => ({
        ...prevUser,
        regions: selectedOptions,
      }));
    }
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
          {/* 비밀번호 입력란 */}
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
          {/* 비밀번호 확인 입력란 */}
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
          {/* 이름 입력란 */}
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
          {/* 닉네임 입력란 */}
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
          {/* 연락처 입력란 */}
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
          {/* 이메일 입력란 */}
          <label htmlFor="email">
            이메일<small>* </small>
          </label>
          <input
            name="email"
            placeholder="이메일을 입력하세요"
            value={user.email}
            onChange={formChange}
          />
          <Button onClick={validateEmail} variant="light" size="sm" className="rounded">이메일 인증</Button>
        </div>
        {/* 인증번호 입력란 */}
        {isVerificationVisible && (
          <div>
            <label htmlFor="verificationCode">
              인증번호<small>* </small>
            </label>
            <input
              type="text"
              placeholder="인증번호를 입력하세요"
              name="verificationCode"
              value={verificationCode}
              onChange={handleVerificationCodeChange}
            /> {/* onClick 수정해야함*/}
            <Button onClick={validateEmail} variant="light" size="sm">인증번호 확인</Button>
          </div>
        )}
         <div>
        {/* 주소 입력란 */}
        {/* 주소 수정중 */}
        <label htmlFor="regions">
          주소<small>* </small>
        </label>
        <select
          className="form-select"
          name="regions"
          onChange={handleRegionsChange}
          value={user.regions}
        >
          <option value="" disabled>
            -- 거주지역을 선택해 주세요 -- (최대 3개)
          </option>
          <option value="서울">서울</option>
          <option value="경기도">경기도</option>
          <option value="기타">기타</option>
        </select>

        <select
          className="form-select"
          name="regions"
          onChange={handleRegionsChange}
          value={user.regions}
        >
          <option value="" disabled>
            -- 거주지역을 선택해 주세요 -- (최대 3개)
          </option>
          <option value="서울">서울</option>
          <option value="경기도">경기도</option>
          <option value="기타">기타</option>
        </select>


        <select
          className="form-select"
          name="regions"
          onChange={handleRegionsChange}
          value={user.regions}
        >
          <option value="" disabled>
            -- 거주지역을 선택해 주세요 -- (최대 3개)
          </option>
          <option value="서울">서울</option>
          <option value="경기도">경기도</option>
          <option value="기타">기타</option>
        </select>
      </div>
        <Button type="submit">Join</Button>
      </Form>
    </div>
  );
};
export default SignUp;