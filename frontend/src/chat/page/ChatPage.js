import { Stomp } from '@stomp/stompjs';
import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client';

const ChatPage = () => {
    const navigate = useNavigate();
    const [chatRoomId, setChatRoomId] = useState("");
    const [chatRoom, setChatRoom] = useState({
        id:"",
        seller:"",
        buyer:"",
        product:"",
        chats:[],
      });
      const [user, setUser] = useState({
        username: "",
        password: "",
        repassword: "",
        name: "",
        nickname: "",
        phone_number: "",
        email: "",
        region: "",
        auth: "", // 추가: 사용자 권한 정보
      });

    useEffect(() => {
        const socket = new SockJS('/api/ws', undefined, {
            cors: {
                origin: 'http://localhost:3000',
                credentials: true,
            }
        });
        
        const stompClient = Stomp.over(socket);

        const onConnect = () => {
            console.log('WebSocket 연결 성공');
            stompClient.send('/app/join', {}, JSON.stringify(11));

            stompClient.subscribe('/queue/sendChatRoomIdToClient/' + user.id, (message) => {
                console.log('WebSocket 메세지 수신: ', message.body);
                const roomId = JSON.parse(message.body);
                setChatRoomId(roomId);
            });
        };

        stompClient.connect({}, onConnect);

        return () => {
            stompClient.disconnect();
        };
    }, [chatRoom.id]);

    const goToChat = () => {
        if (chatRoomId) {
            navigate(`/chat/${chatRoomId}`);
        } else {
            console.error('Chat room ID not available');
            // 오류 처리 추가
            alert('Chat room ID not available');
        }
    };

    return (
        <div>
            <Button variant='outline-dark mb-3' onClick={goToChat}>채팅하기</Button>
            <Button variant='outline-dark mb-3' onClick={() => navigate('/chatList')}>채팅목록</Button> 
        </div>
    );
};

export default ChatPage;
