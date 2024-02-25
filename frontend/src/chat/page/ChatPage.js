import { Stomp } from '@stomp/stompjs';
import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client';

const ChatPage = () => {
    const navigate = useNavigate();
    const [chatRoomId, setChatRoomId] = useState("");
    const [chatRoom, setChatRoom] = useState({
        seller: { id: "" }, // 초기값 설정
        buyer: { id: "" },  // 초기값 설정
        product: { id: "" } // 초기값 설정
    });
    const [user, setUser] = useState({
        id:"",
        username:"",
        name:"",
    });

    useEffect(() => {
        const requestData = {
            sellerId: chatRoom.seller.id,
            buyerId: chatRoom.buyer.id,
            productId: chatRoom.product.id
        };

        fetch("http://localhost:8080/chatroom/room", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // 채팅방 ID 업데이트
            setChatRoomId(data.id);
            // 채팅방 생성 후 이동
            navigate(`/chat/${data.id}`);
        })
        .catch(error => {
            console.error('Error:', error);
            // 오류 처리 추가
            alert('Failed to create chat room');
        });

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
