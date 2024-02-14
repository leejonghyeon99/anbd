package com.lec.spring.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender javaMailSender;
    private static final String senderEmail = "goun3596@gmail.com";

    private static int number;

    public static void createNumber(){
        number = (int)(Math.random()*9000) + 100000;
    }

    public MimeMessage CreateMail(String email){
        createNumber();
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            message.setFrom(senderEmail);
            message.setRecipients(MimeMessage.RecipientType.TO, email);
            message.setSubject("ANDB EMAIL 인증");
            String body = "";
            body += "<h3>" + "요청하신 인증 번호입니다." + "</h3>";
            body += "<h1>" + number + "</h1>";
            body += "<h3>" + "감사합니다." + "</h3>";
            message.setText(body,"UTF-8", "html");
        } catch (MessagingException e) {
            log.debug("인증이메일 제작 에러");
            throw new RuntimeException(e);
        }
        return message;
    }

    public int sendMail(String email){
        MimeMessage message = CreateMail(email);
        javaMailSender.send(message);

        return number;
    }
}
