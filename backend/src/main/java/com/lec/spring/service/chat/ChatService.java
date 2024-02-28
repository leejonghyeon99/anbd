package com.lec.spring.service.chat;

import com.lec.spring.domain.Chat;
import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.User;
import com.lec.spring.repository.ChatRepository;
import com.lec.spring.repository.ChatRoomRepository;
import com.lec.spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;

//    @Transactional
    public Chat saveMessage(String message, String userId, Integer chatRoomId) {

        User user = userRepository.findByUsername(userId).orElse(null);
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);

        Chat chat = new Chat();
        chat.setUser(user);
        chat.setChatRoom(chatRoom);
        chat.setMessage(message);

        return chatRepository.saveAndFlush(chat);
    }
}
