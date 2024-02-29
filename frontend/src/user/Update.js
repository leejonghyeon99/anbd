import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import regionsData from "../api/regionsData.json";
import { fetchWithToken } from './Reissue';


const Update = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: "",
    nickname: "",
    phone_number: "",
    email: "",
    region: "",
  });

    // 유저 정보 변경 확인을 위한 상태 추가
    const [originalEmail, setOriginalEmail] = useState("");
    const [emailChanged, setEmailChanged] = useState(false);

  //유효성 검사를 위한 State함수들
  const [nameErr, setNameErr] = useState(false);
  const [nicknameErr, setNicknameErr] = useState(false);
  const [phoneErr, setPhoneErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [regError, setRegError] = useState(false);

  // 토큰으로 유저 정보 불러오기
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/user/info`, {
        headers: {
          Authorization: `Bearer ${token}`, // JWT를 Authorization 헤더에 추가
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserInfo(data)
          setOriginalEmail(data.email); // 원래 이메일 주소 저장
        })
        .catch((error) => console.error("userInfo error", error));
    };
  }, []);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  // 변경되는 유저 정보값 받아오기
  function infoChange(e) {
    const { name, value } = e.target;

    setUserInfo((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

        // 이메일 주소가 변경되었는지 확인
        if (name === "email" && value !== originalEmail) {
          setEmailChanged(true);
        } else if (name === "email" && value === originalEmail) {
          setEmailChanged(false);
        }
  }

  //유효성 검사
  const validateForm = () => {
    const isNameErr = userInfo.name.trim() === "";
    const isNicknameErr = userInfo.nickname.trim() === "";
    const isPhoneErr = userInfo.phone_number.trim() === "";
    const isEmailErr = userInfo.email.trim() === "";
    const isRegError = userInfo.region === "";

    setNameErr(isNameErr);
    setNicknameErr(isNicknameErr);
    setPhoneErr(isPhoneErr);
    setEmailErr(isEmailErr);
    setRegError(isRegError);

    return !(
      isNameErr ||
      isNicknameErr ||
      isPhoneErr ||
      isEmailErr ||
      isRegError 
    );
  };

    // 인증번호 입력란 가시성 상태 변수
    const [isVerificationVisible, setIsVerificationVisible] = useState(false);
    // 인증번호 상태 변수
  const [code, setCode] = useState("");
    // 인증 성공 상태 추가
    const [isVerified, setIsVerified] = useState(false);

      // 이메일인증 버튼 클릭 시 유효성 검증
  const validateEmail = () => {

    if (!emailChanged) {
      alert("이미 인증된 이메일 주소입니다.");
      return;
    }

    // 이메일이 비어 있는지 확인
    if (userInfo.email.trim() === '') {
      setEmailErr("empty");
      setIsVerificationVisible(false); // 이메일이 비어있을 때는 인증번호 입력란 숨김
      return false;
     // 에러가 발생하면 여기서 함수 실행을 중단
    } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
      setEmailErr("format");
      setIsVerificationVisible(false); // 이메일 형식이 맞지 않을 때는 인증번호 입력란 숨김
      return false;
    } else {
      setEmailErr(null); // 에러가 없으면 에러 상태를 null로 설정

      // 이메일 유효성 검사를 통과했을 경우에만 인증번호 입력란을 보여줌
      setIsVerificationVisible(true);
      // 이메일 인증코드 보내기
      requestEmailVerification();
      return true;
    }
  };

  // 이메일 인증코드 보내기
  const requestEmailVerification = async () => {
   
    // 이메일 유효성 검사를 통과한 경우, 서버로 이메일 인증 요청
    await fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/email/verification-requests?email=${userInfo.email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ email: userInfo.email }),
    })
    .then((response) => {
      if (response.status===200) {
        // 이메일 인증 요청 성공 처리
        alert("인증 코드가 발송되었습니다. 이메일을 확인해주세요.");
      } else {
        console.log(userInfo.email);
        // 서버 측 에러 처리
        alert("인증 코드 발송에 실패했습니다.");
      }
    })
    .catch((error) => {
      console.error('이메일 인증 중 오류 발생:', error);
    });
  };


  // 인증번호 입력 핸들러 함수
  const codeChange = (e) => {
    setCode(e.target.value);
  };


  const verifyCode = async (email, code) => {
    try {
      const response = await fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/email/verifications?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log("서버 응답:", data);
  
      if (data.verified) {
        alert("인증 성공!");
        setIsVerified(true); // 인증 성공 상태 업데이트

      } else {
        alert("인증 실패. 코드를 다시 확인해주세요.");
        setIsVerified(false); // 인증 실패 상태를 유지하거나 업데이트
      }
    } catch (error) {
      console.error("인증 중 오류 발생", error);
    }
  };
  


  // 유저 정보 수정하기
  function updateUser(e) {
    e.preventDefault(); // 기본 제출 동작 방지

    if (validateForm()) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/user/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userInfo),
        })
          .then((response) => {
            if (response.ok) {
              alert("회원정보 수정완료");
              return response.json();
            } else {
              return Promise.reject("회원정보 수정에 실패했습니다.");
            }
          })
          .then((data) => {
            console.log(data);
            setUserInfo(data); // 응답 데이터로 상태 업데이트
            navigate("/home");
          })
          .catch((error) => {
            console.error("회원정보 수정오류", error);
            alert(error);
          });
      }
    }
  }

  // 회원탈퇴 기능
  const deleteUser = () => {
    const recheck = window.confirm("정말 탈퇴하시겠습니까?");

    if (recheck) {
      const token = localStorage.getItem("accessToken");

      fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/user/deleteUser`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            localStorage.removeItem("accessToken");
            alert("회원탈퇴 성공");
            navigate("/home");
            window.location.reload();
          } else {
            alert("회원탈퇴 실패");
          }
        })
        .catch((error) => {
          console.error("회원 탈퇴 중 에러 발생:", error);
          alert("오류가 발생했습니다.");
        });
    }
  };
  return (
    <div>
      <Form onSubmit={updateUser}>
        {/* 이름 수정 */}
        <div>
          <label htmlFor="name">
            이름 <small>* </small>
          </label>
          <input name="name" value={userInfo.name} onChange={infoChange} />
        </div>
        {nameErr && (
          <div>
            <small className="text-danger">이름은 필수입니다</small>
          </div>
        )}
        <div>
          {/* 닉네임 수정 */}
          <label htmlFor="nickname">
            닉네임 <small>* </small>
          </label>
          <input
            name="nickname"
            value={userInfo.nickname}
            onChange={infoChange}
          />
        </div>
        {nicknameErr && (
          <div>
            <small className="text-danger">닉네임은 필수입니다</small>
          </div>
        )}

        <div>
          {/* 연락처 수정 */}
          <label htmlFor="phone_number">
            연락처 <small>* </small>
          </label>
          <input
            name="phone_number"
            value={userInfo.phone_number}
            onChange={infoChange}
          />
        </div>
        {phoneErr && (
          <div>
            <small className="text-danger">연락처는 필수입니다</small>
          </div>
        )}

        <div>
          {/* 이메일 수정 */}
          <label htmlFor="email">
            이메일 <small>* </small>
          </label>
          <input name="email" value={userInfo.email} onChange={infoChange} /> 
          {!isVerified && <Button
            onClick={validateEmail}
            variant="light"
            size="sm"
            className="rounded"
          >
            이메일 인증
          </Button>}
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
        <div>
          {/* 인증번호 입력란 */}
        {isVerificationVisible && !isVerified && (
          <div>
            <label htmlFor="verificationCode">
              인증번호 <small>* </small>
            </label>
            <input
              type="text"
              placeholder="인증번호를 입력하세요"
              name="code"
              value={code}
              onChange={codeChange}
            />{" "}
            <Button onClick={() => verifyCode(userInfo.email, code)} variant="light" size="sm">
              인증번호 확인
            </Button>
          </div>
        )}
         {/* 인증 성공 메시지 */}
         {isVerified && <div style={{ color: 'blue' }}>[이메일 인증 완료]</div>}
        <div></div>
          {/* 주소 수정 */}
          <label htmlFor="region">
            주소 <small>* (최대 3개) </small>
          </label>

          {/*
        regionsData.features.map()을 사용하여 JSON 파일의 "SIG_KOR_NM"을 옵션으로 동적으로 추가합니다.
      */}
          <select
            className="form-select"
            name="region"
            onChange={infoChange}
            value={userInfo.region}
          >
            <option value="" disabled>
              -- 거주지역을 선택해 주세요 --
            </option>

            {/* 거주지역 select option을 regionsData에서 map으로 가져온다. */}
            {regionsData.features
              .map((feature) => feature.properties.SIG_KOR_NM)
              .sort((a, b) => a.localeCompare(b))
              .map((sortedSIG_KOR_NM, index) => (
                <option key={index} value={sortedSIG_KOR_NM}>
                  {sortedSIG_KOR_NM}
                </option>
              ))}
          </select>
        </div>
        {regError && (
          <div>
            <small className="text-danger">거주지역을 선택해주세요</small>
          </div>
        )}
        <Button onClick={updateUser}>회원 수정</Button>
        <Button as={Link} to="/user/updatePassword">비밀번호 수정</Button>
        <Button onClick={deleteUser}>회원 탈퇴</Button>
        <Button onClick={() => navigate('/home')}>HOME</Button>
      </Form>
    </div>
  );
};

export default Update;
