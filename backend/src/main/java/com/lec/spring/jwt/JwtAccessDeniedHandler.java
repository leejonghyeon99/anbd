package com.lec.spring.jwt;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {

        // 응답이 이미 커밋된 상태인지 확인
        if (!response.isCommitted()) {
            // 필요한 권한이 없이 접근하려 할때 403
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied");
            System.out.println("필요한 권한이 없이 접근 오류 403");
        }
    }
}
