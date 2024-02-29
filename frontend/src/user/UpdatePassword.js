import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchWithToken } from './Reissue';

const UpdatePassword = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem("accessToken");

    const [userInfo, setUserInfo] = useState({
      id: "",
      password: "",
      repassword: "",
    });

// 토큰으로 유저 정보 불러오기
useEffect(() => {
  if (token) {
    fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/user/info`, {
      headers: {
        Authorization: `Bearer ${token}`, // JWT를 Authorization 헤더에 추가
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserInfo(prevState => ({
          ...prevState,
          id: data.id // id 필드만 업데이트
        }));
      })
      .catch((error) => console.error("userInfo error", error));
  }
}, [token]);

    const [passwordMatchErr, setPasswordMatchErr] = useState(false);
    const [isEmptyPassword, setIsEmptyPassword] = useState(false);


  // 변경되는 유저 정보값 받아오기
  function infoChange(e) {
    const { name, value } = e.target;

    setUserInfo((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    if (name === 'password') {
      setIsEmptyPassword(!value);
    }
  }

  //유효성 검사
  const validateForm = () => {

    const isPasswordMatchErr = userInfo.repassword !== userInfo.password;
    const isEmptyPasswordCheck = !userInfo.password; // 비밀번호 입력란이 비었는지 확인

    setPasswordMatchErr(isPasswordMatchErr);
    setIsEmptyPassword(isEmptyPasswordCheck); // isEmptyPassword 상태 업데이트

    return !(
      isPasswordMatchErr || isEmptyPasswordCheck // 비밀번호가 비었거나, 비밀번호가 일치하지 않으면 false 반환
    );
  };

  // 유저 정보 수정하기
  function updatePassword(e) {
    e.preventDefault(); // 기본 제출 동작 방지

    if (validateForm()) {
      
      if (token) {
        fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/user/updatePassword`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
           // userInfo에서 password만 추출하여 전송
        body: JSON.stringify({ id: userInfo.id, password: userInfo.password }),
        })
          .then((response) => {
            if (response.ok) {
              alert("비밀번호 변경완료");
              console.log(userInfo.password);
              return response.json();
            } else {
              alert("비밀번호 변경에 실패했습니다.");
            }
          })
          .then((data) => {
            console.log(data);
            setUserInfo(data); // 응답 데이터로 상태 업데이트
            navigate("/home");
          })
          .catch((error) => {
            console.error("비밀번호 변경오류", error);
          });
      }
    }
  }

    // 이전 화면으로 돌아가는 함수
    const goBack = () => {
      navigate(-1); // -1을 사용하면 이전 화면으로 이동합니다.
    };

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
            {isEmptyPassword && (
          <div>
            <small className="text-danger">
              비밀번호를 입력하세요.
            </small>
          </div>
        )}
        </div>
        <Button onClick={updatePassword}>비밀번호 수정</Button>
        <Button onClick={goBack}>이전으로</Button>
        </Form>
    );
};

export default UpdatePassword;