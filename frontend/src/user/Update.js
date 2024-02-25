import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import regionsData from "../api/regionsData.json";
import UpdatePassword from "./UpdatePassword";

const Update = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    password: "",
    repassword: "",
    name: "",
    nickname: "",
    phone_number: "",
    email: "",
    region: "",
  });



  //유효성 검사를 위한 State함수들
  const [nameErr, setNameErr] = useState(false);
  const [nicknameErr, setNicknameErr] = useState(false);
  const [phoneErr, setPhoneErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [regError, setRegError] = useState(false);
  const [passwordMatchErr, setPasswordMatchErr] = useState(false);

  // 토큰으로 유저 정보 불러오기
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/info`, {
        headers: {
          Authorization: `Bearer ${token}`, // JWT를 Authorization 헤더에 추가
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const updatedUserInfo = {
            ...data,
            password: userInfo.password || data.password,
            repassword: userInfo.repassword || data.password,
          };
          setUserInfo(updatedUserInfo)
        })
        .catch((error) => console.error("userInfo error", error));
    }
  }, [userInfo.password]);

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
  }

  //유효성 검사
  const validateForm = () => {
    const isNameErr = userInfo.name.trim() === "";
    const isNicknameErr = userInfo.nickname.trim() === "";
    const isPhoneErr = userInfo.phone_number.trim() === "";
    const isEmailErr = userInfo.email.trim() === "";
    const isRegError = userInfo.region === "";
    const isPasswordMatchErr = userInfo.repassword !== userInfo.password;

    setNameErr(isNameErr);
    setNicknameErr(isNicknameErr);
    setPhoneErr(isPhoneErr);
    setEmailErr(isEmailErr);
    setRegError(isRegError);
    setPasswordMatchErr(isPasswordMatchErr);

    return !(
      isNameErr ||
      isNicknameErr ||
      isPhoneErr ||
      isEmailErr ||
      isRegError ||
      isPasswordMatchErr
    );
  };

  // 유저 정보 수정하기
  function updateUser(e) {
    e.preventDefault(); // 기본 제출 동작 방지

    if (validateForm()) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/update`, {
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
              console.log(userInfo.password);
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

      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/deleteUser`, {
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
        </div>
        {emailErr && (
          <div>
            <small className="text-danger">메일은 필수입니다</small>
          </div>
        )}
        <div>
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
