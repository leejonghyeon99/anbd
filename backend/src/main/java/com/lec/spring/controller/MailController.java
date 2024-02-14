package com.lec.spring.controller;

import com.lec.spring.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequiredArgsConstructor
public class MailController {

    private final MailService mailService;

    @ResponseBody
    @PostMapping("/api/email")
    public String MailSend(String email){

        int number = mailService.sendMail(email);

        String num = "" + number;

        return num;
    }
}
