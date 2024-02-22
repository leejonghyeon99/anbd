import { Stomp } from '@stomp/stompjs';
import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client';

const ChatPage = () => {
    const navigate = useNavigate();
    // 채팅방
    const [chatRoom, setChatRoom] = useState({
        id:"",
        seller:"",
        buyer:"",
        product:"",
        chats:[],
    });

    const [user, setUser] = useState({
        id:"",
        username:"",
        name:"",
    })

    useEffect(() => {
        // SockJS를 사용하여 WebSocket 연결
        const userId = user.id;
        const socket = new SockJS('/api/ws', undefined, {
            cors: {
                origin: 'http://localhost:3000',
                credentials: true,
            }
        });
        
        const stompClient = Stomp.over(socket);

        const onConnect = () => {
            console.log('WebSocket 연결 성공');
            // 서버로 사용자 ID 전송하여 채팅방 생성 요청 보내기
            stompClient.send('/app/join', {}, JSON.stringify({ userId }));

            stompClient.subscribe('/queue/sendChatRoomIdToClient', (message) => {
                console.log('WebSocket 메세지 수신: ', message.body);
                const roomId = JSON.parse(message.body);
                setChatRoom({ ...chatRoom, id: roomId });
            });
        };

        stompClient.connect({}, onConnect);

        return () => {
            // 컴포넌트가 언마운트 될 때 연결 해제
            stompClient.disconnect();
        };
    }, []);

    // 채팅 페이지로 이동하는 함수
    const goToChat = () => {
        const chatRoomId = chatRoom.id;
        if (chatRoomId) {
            navigate(`/chat/${chatRoomId}`); // 채팅방 ID가 있을 경우에만 이동
        } else {
            console.error('Chat room ID not available');
        }
    };

    return (
        <div>
            {/* 채팅하기 버튼을 누르면 goToChat 함수를 호출하여 채팅방으로 이동 */}
            <Button variant='outline-dark mb-3' onClick={goToChat}>채팅하기</Button>
            {/* 채팅 목록 버튼에도 동일한 방식으로 채팅 목록 페이지로 이동할 수 있음 */}
            <Button variant='outline-dark mb-3' onClick={() => navigate('/chatList')}>채팅목록</Button>
        </div>
    );
};

export default ChatPage;
