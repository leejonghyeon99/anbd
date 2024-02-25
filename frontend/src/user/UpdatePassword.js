import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {

    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
      password: "",
      repassword: "",
    });

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

    const isPasswordMatchErr = userInfo.repassword !== userInfo.password;

    setPasswordMatchErr(isPasswordMatchErr);

    return !(
      isPasswordMatchErr
    );
  };

  // 유저 정보 수정하기
  function updatePassword(e) {
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

    return (
        <Form onSubmit={updatePassword}>
             <div>
          {/* Password 수정 */}
          <label htmlFor="password">
            비밀번호 <small>* </small>
          </label>
          <input
            type="password"
            name="password"
            onChange={infoChange}
          />
        </div>

        <div>
          {/* Re-enter Password 수정 */}
          <label htmlFor="repassword">
            비밀번호 확인 <small>* </small>
          </label>
          <input
            type="password"
            name="repassword"
            onChange={infoChange}
          />
          {passwordMatchErr && (
            <div>
              <small className="text-danger">
                비밀번호와 비밀번호 확인이 일치하지 않습니다.
              </small>
            </div>
          )}
        </div>
        <Button onClick={updatePassword}>회원 수정</Button>
        </Form>
    );
};

export default UpdatePassword;