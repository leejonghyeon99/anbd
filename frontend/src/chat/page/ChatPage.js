import { Stomp } from '@stomp/stompjs';
import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client';

const ChatPage = () => {
    const navigate = useNavigate();
    const [stompClient, setStompClient] = useState(null); // WebSocket 클라이언트 상태 추가
    const [chatRoomId, setChatRoomId] = useState(""); // 채팅방 ID 상태 추가
    const [message, setMessage] = useState(""); // 메시지 상태 추가
    const [chatRoom, setChatRoom] = useState({ // 채팅방 정보 상태 추가
        id:"",
        seller:"",
        buyer:"",
        product:"",
        chats:[],
    });

    const [chat, setChat] = useState([]); // 채팅 내용 상태 추가

    const [user, setUser] = useState({ // 사용자 정보 상태 추가
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
        // WebSocket 연결 설정
        const socket = new SockJS('/api/ws', undefined, {
            cors: {
                origin: 'http://localhost:3000',
                credentials: true,
            }
        });
        const stompClient = Stomp.over(socket);
        
        const onConnect = () => {
            console.log('WebSocket 연결 성공');
            // stompClient.send('/app/join', {}, JSON.stringify(chatRoom.buyer)); // 서버에 사용자 ID 전송
            const roomId = chatRoom.id;
            console.log(roomId);

            stompClient.subscribe('/queue/sendChatRoomIdToClient/' + roomId, (message) => {
                console.log('WebSocket 메세지 수신: ', message.body);
                const receivedMessage = JSON.parse(message.body);
                setChat(prevMessages => [...prevMessages, receivedMessage]); // 받은 메시지를 채팅 목록에 추가
            });
        };

        // WebSocket 연결
        stompClient.connect({}, onConnect);

        // 컴포넌트 언마운트 시 WebSocket 연결 해제
        return () => {
            stompClient.disconnect();
        };
    }, [user.id]);  // 사용자 ID 변경 시 재연결

    // 메시지 전송 함수
    const sendMessageButtonClick = async () => {
        if (message.trim().length > 0) { // 메시지가 비어 있지 않은지 확인
            console.log('message', message);

            // 이미 연결된 WebSocket 이 있다면 메세지 전송
            if (stompClient && stompClient.connected) {
                const messageObject = {
                    userId: user.id,
                    message: chat.message,
                    chatRoomId: chatRoom.id
                    // 필요한 필드 추가 가능
                };
                console.log("messageObject", messageObject);
                // 서버로 메시지 전송
                stompClient.send('/app/chat/sendMessage', {}, JSON.stringify(messageObject));
                setMessage(''); // 메시지 초기화
            }
        }
    };

    return (
        <div>
            {/* 채팅 화면 UI */}
            <ul>
                {chat.map((message, index) => (
                    <li key={index}>{message.text}</li>
                ))}
            </ul>
            {/* 메시지 입력 폼 */}
            <input 
                type="text" 
                value={message} 
                onChange={(event) => setMessage(event.target.value)} // 입력한 메시지 업데이트
                onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                        sendMessageButtonClick(); // 엔터 키 입력 시 메시지 전송
                    }
                }} 
            />
        </div>
    );
};

export default ChatPage;
