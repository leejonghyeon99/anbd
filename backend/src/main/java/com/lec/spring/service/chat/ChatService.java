package com.lec.spring.service.chat;

import com.lec.spring.domain.Chat;
import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.User;
import com.lec.spring.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;

    @Transactional
    public Chat saveMessage(String message, User user, ChatRoom chatRoom) {
        Chat chat = new Chat();
        chat.setMessage(message);
        chat.setUser(user);
        chat.setChatRoom(chatRoom);

        return chatRepository.save(chat);
    }
}
