import { Stomp } from '@stomp/stompjs';
import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client';

const ChatPage = () => {
    const navigate = useNavigate();
    const [chatRoomIdMap, setChatRoomIdMap] = useState({}); // 상품별 채팅방 ID 매핑
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        // SockJS를 사용하여 WebSocket 연결
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);

        // 연결 시도
        client.connect({}, () => {
            console.log('웹 소켓에 연결되었습니다');

            // 서버로 사용자 ID 전송
            client.send('/app/join', {}, JSON.stringify({buyerId: 1, productId: 1})); // 여기에 사용자 ID 입력

            // 채팅방 ID 수신
            const subscription = client.subscribe('/queue/sendChatRoomIdToClient/1', (message) => { // 여기에 사용자 ID 입력
                const { productId, chatRoomId } = JSON.parse(message.body);
                console.log(`받은 채팅방 ID (상품 ${productId}):`, chatRoomId);
                // 여기에서 채팅방 ID를 사용하여 다른 작업을 수행할 수 있습니다.
                // setChatRoomId(chatRoomId); // 채팅방 ID를 상태에 업데이트
                // 상품별 채팅방 ID 매핑 업데이트
                setChatRoomIdMap(prevState => ({
                    ...prevState,
                    [productId]: chatRoomId
                }));
            });
            setStompClient(client);

            // cleanup 함수에서 구독 해제
            return () => {
                console.log('웹 소켓과의 연결이 해제되었습니다');
                subscription.unsubscribe();
            };
        });
    }, []);

    // 채팅 페이지로 이동하는 함수
    const goToChat = (productId) => {
        const chatRoomId = chatRoomIdMap[productId];
        if (chatRoomId) {
            navigate(`/chat/${chatRoomId}`); // 채팅방 ID가 있을 경우에만 이동
        } else {
            console.error('Chat room ID not available for product', productId);
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
