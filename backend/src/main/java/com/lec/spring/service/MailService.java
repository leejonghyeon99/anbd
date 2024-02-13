package com.lec.spring.service;

import com.lec.spring.config.BusinessLogicException;
import com.lec.spring.domain.ExceptionCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender javaMailSender;

    public void sendEmail(String toEmail, String title, String content){
        SimpleMailMessage simpleMailMessage = createEmailForm(toEmail, title, content);

        try {
            javaMailSender.send(simpleMailMessage);
        } catch (RuntimeException e) {
            log.debug("MailService.sendEmail exception occur toEmail : {}, " +
                    "title: {}, text: {}", toEmail, title, content);
            throw new BusinessLogicException(ExceptionCode.UNABLE_TO_SEND_EMAIL);
        }


    }

    private SimpleMailMessage createEmailForm(String toEmail, String title, String content) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(title);
        message.setText(content);

        return message;

    }
}
