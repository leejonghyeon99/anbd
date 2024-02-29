import { jwtDecode } from "jwt-decode";


export const fetchWithToken = async (url, options = {}) => {
  let accessToken = localStorage.getItem('accessToken');
    
  // 기본 요청 옵션에 Authorization 헤더 추가
  const fetchOptions = {
      ...options,
      headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`,
      },
      method: "GET"
  };

  let response = await fetch(url, fetchOptions);

  // 만약 응답이 401 Unauthorized라면 토큰 재발급을 시도합니다.
  if (response.status === 401) {
      // 여기에서 토큰 재발급 로직을 구현합니다.
      const reissueResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/reissue`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          // 유저네임을 이용한 재발급 요청이 아닌 다른 인증 정보가 필요한 경우 수정 필요
          body: JSON.stringify({ username: jwtDecode(accessToken).sub }), 
      });

      if (reissueResponse.ok) {
          const reissueData = await reissueResponse.json();
          localStorage.setItem('accessToken', reissueData.accessToken);
          accessToken = reissueData.accessToken;

          // 재발급 받은 토큰을 사용하여 요청을 재시도합니다.
          response = await fetch(url, {
              ...fetchOptions,
              headers: {
                  ...fetchOptions.headers,
                  'Authorization': `Bearer ${accessToken}`,
              },
          });
  

      } else {
          // 재발급 실패 시 처리 (예: 사용자 로그아웃 처리)
          console.error("Token reissue failed. Please login again.");
          // 로그아웃 처리 로직 추가
          return null;
      }
  }

  return response;
  };