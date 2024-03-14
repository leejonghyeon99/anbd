import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { MypagebarList } from "../components/MypagebarList";
import { AdminpagebarList } from "../components/AdminpagebarList";
import "./CSS/Header.css";
import "./CSS/Mypagebar.css";
import Logout from '../user/Logout';
import { fetchWithToken } from "../user/Reissue";

const Navbar = styled.div`
  /* 다른 스타일들... */
  display: ${(props) => (props.isvisible === "true" ? "block" : "none")};
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: #ffffff;
  transition: right 0.3s ease-in-out;
  border: 3px solid rgba(0, 0, 0, 0.466);
  
  @media screen and (max-width: 768px) {
    width: 70%;
  }
`;

const Header = () => {

  const headerRef = useRef(null);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줌
    const day = today.getDate();

    return `${year} ${month} ${day}`;
  };

  const [user, setUser] = useState({
    username: "",
    password: "",
    // repassword: "",
    name: "",
    nickname: "",
    phone_number: "",
    email: "",
    region: "",
    auth: "", // 추가: 사용자 권한 정보,
    thumbnail : "",
  });

  // 로그인 유무 상태(useEffect로 상태 확인해야함)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const getUserInfoFromToken = (token) => {
      const decodedToken = atob(token.split(".")[1]);
      const userInfo = JSON.parse(decodedToken);
      console.log("userInfo", userInfo)
      return userInfo;
    };

    const userData = async () => {
      try {
        if (token) {
          // 토큰에서 사용자 정보를 추출
          const userInfo = getUserInfoFromToken(token);

          // 사용자 정보를 상태값에 설정
          setUser(userInfo);

          // 서버에 사용자 정보 요청 보내기
          const response = await fetchWithToken(
            `${process.env.REACT_APP_API_BASE_URL}/api/user/info`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const additionalUserInfo = await response.json();
            // 서버에서 받은 추가 정보를 기존 사용자 정보에 합치기
            setUser((prevUserInfo) => ({
              ...prevUserInfo,
              ...additionalUserInfo,
            }));
          } else {
            console.error("Header - Failed to fetch additional user info");
          }
        } else {
          // console.log("No token found, user is not logged in");
        }
      } catch (error) {
        console.error("Header - Error fetching data:", error);
      }
    };

    // userData 함수 실행 (컴포넌트가 마운트될 때 한 번만 실행하도록 빈 배열 전달)
    userData();
  }, []);

  // Mypage 버튼
  const [isMypageVisible, setIsMypageVisible] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        // 클릭된 요소가 Header 외부에 있으면 Navbar를 닫음
        setIsMypageVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMypageVisible]);


  // mypage show/hide
  const toggleMypage = () => {
    console.log("user.auth", user.auth);
    setIsMypageVisible(!isMypageVisible);
  };

  useEffect(() => {
    const getUser = async () =>{
      const url = `${process.env.REACT_APP_API_BASE_URL}/api/user/profile`;
      const options = {
        
      }
      try{
        await fetchWithToken(url,options)
        .then(response => {
          if(response.status === 200){
            return response.json();
          }
        })
        .then(data => {
          console.log(data);
          setUser(data);
        })
      }catch{
        console.log('not logged in.')
      }     
    }
    getUser();
  },[])

  const  handleChangeImg = (file) => {

    const formData = new FormData();
    formData.append('thumbnail', file);
    const changeImg = async () =>{
      const url = `${process.env.REACT_APP_API_BASE_URL}/api/user/change/thumbnail`;
      const options = {
        method : "POST",
        body: formData,
      }
      await fetchWithToken(url,options)
            .then(response => {
              if(response.status === 201){
                return response.json();
              }
            })
            .then(data => {
              console.log(data);
              setUser(data);
            })     
    }
    changeImg();
  }

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleChangeImg(file);
  };


  return (
    <div className="header">
      <div ref={headerRef}>
        <div className="headerBox">
          <div className="headerFix">
            <div className="logo">
              <Link to="/home" className="goHome">
                <img src="/img/004-1.png" />
              </Link>
            </div>

            {/* 로그인한 유저와 비회원의 mypage아이콘 다르게 나오도록 */}
            <div className="mypageToggle" id="menu-bars">
              {user.auth === "ROLE_USER" && (
                
                <img
                  src="/icon/user2.png"
                  id="userIcon"
                  onClick={toggleMypage}
                />
              
              )}
              {user.auth === "ROLE_ADMIN" && (
               
                <img
                  src="/icon/admin2.png"
                  id="adminIcon"
                  onClick={toggleMypage}
                />
             
              )}
              {user.auth !== "ROLE_USER" && user.auth !== "ROLE_ADMIN" && (
                <div className="anonymous">
                  <Link to="user/login">LOGIN</Link>{" "}
                  <Link to="user/signup">JOIN</Link>
                </div>
              )}
            </div>
          </div>
                
          <Navbar isvisible={isMypageVisible.toString()} id="navbar">
            {" "}
            {/* Navbar의 isVisible 속성에 따라 보이거나 숨김 */}
            <nav className="nav-menu">
              <Link className="navbar-toggle">
                <img
                  src="/icon/Xmark.png"
                  className="closeMypage"
                  onClick={toggleMypage}
                />
              </Link>
              <div className="mypage_nickname">
              <p className="datetime">Today {getCurrentDate()}</p>
              <br/>
              <br/>
                <p>
                  ID: {user.username}
                  <br />
                  닉네임: {user.nickname}
                </p>
              </div>
              <div>
                <Link to={"/user/passwordcheck"} className="moveToUpdate" onClick={toggleMypage}>
                  <small>회원정보수정</small>
                </Link>
              </div>
              <div className="profile">
                <input
                  type="file"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <img
                  src={`${apiUrl}/upload/thumbnail/${user.thumbnail}`}
                  className="profileImg"
                  onClick={handleClick}
                />
              </div>

              <div className="mypage_auth">
                {user.auth === "ROLE_USER" && (
                  
                  <div className="userbar">                    
                    <Link
                      to={"/chat/room"}
                      onClick={toggleMypage}
                    >
                      <img
                        src="/icon/chatting.png"
                        className="chatIcon_mp"
                      />
                    </Link>

                    <div id="mypageMenu">
                      <ul className="nav-menu-items">
                        {MypagebarList.map((item, index) => (
                          <li key={index} className={item.cName} id="menuTitle">
                            <Link
                              to={item.path}
                              className="mypageList"
                              onClick={toggleMypage}
                            >
                              {item.icon} <span>{item.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {user.auth === "ROLE_ADMIN" && (
                  <div>
                    <ul id="adminbar">
                      {AdminpagebarList.map((item, index) => (
                        <li key={index} className={item.cName} id="menuTitle">
                          <Link
                            to={item.path}
                            className="mypageList"
                            onClick={toggleMypage}
                          >
                            {item.icon} <span>{item.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </nav>
            {/*로그아웃 버튼!! */}
            <Logout/>
          </Navbar>
        </div>
      </div>
    </div>
  );
};

export default Header;
