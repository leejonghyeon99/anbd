import { jwtDecode } from "jwt-decode";

export const fetchWithToken = async (url, options = {},isFormData = false) => {
  let accessToken = localStorage.getItem("accessToken");

  // 엑세스 토큰 확인
  if (!accessToken) {
    console.error("No access token found.");
    return null;
  }

  // 디코딩된 토큰 확인
  let decodedToken;
  try {
    decodedToken = jwtDecode(accessToken);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }

  const currentTime = Date.now() / 1000; // 현재 시간을 초 단위로 변환

  // 토큰 만료 1분 전이면 재발급 시도
  if (decodedToken.exp < currentTime + 60) {
    const reissueResponse = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/auth/reissue`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: decodedToken.sub,
        }), // 'sub'는 일반적으로 사용자를 나타냄
      }
    );

    if (reissueResponse.ok) {
      const reissueData = await reissueResponse.json();
      localStorage.setItem("accessToken", reissueData.accessToken);
      accessToken = reissueData.accessToken;
    } else {
      // 재발급 실패 시 처리
      console.error("Token reissue failed. Please login again.");
      return null;
    }
  }

  // 기본 요청 옵션에 Authorization 헤더 추가
  const fetchOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  // isFormData가 true인 경우, Content-Type 헤더를 설정하지 않습니다.
  if (!isFormData) {
    fetchOptions.headers['Content-Type'] = 'application/json';
  } else {
    // FormData를 사용하는 경우, fetchOptions.headers 객체에서 Content-Type을 삭제합니다.
    delete fetchOptions.headers['Content-Type'];
  }

  let response = await fetch(url, fetchOptions);

  // 만약 응답이 401 Unauthorized라면 추가 처리가 필요할 수 있음
  if (response.status === 401) {
    console.error("401 Unauthorized");
  }

  return response;
};