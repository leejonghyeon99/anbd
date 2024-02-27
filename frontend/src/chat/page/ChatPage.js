import { SoundTwoTone } from '@ant-design/icons';
import { Stomp } from '@stomp/stompjs';
import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';

const ChatPage = () => {
    const [stompClient, setStompClient] = useState(null);
    const [chatRoomId, setChatRoomId] = useState("");
    const [message, setMessage] = useState("");
    const [chatRoom, setChatRoom] = useState({
        id: "",
        seller: "",
        buyer: "",
        product: "",
        chats: [],
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
    const token = localStorage.getItem("accessToken");
    const getUserInfoFromToken = (token) => {
        const decodedToken = atob(token.split(".")[1]);
        const userInfo = JSON.parse(decodedToken);
        return userInfo;
    };

    const userData = async () => {
        try {
        if (token) {
            // 토큰에서 사용자 정보를 추출
            const userInfo = getUserInfoFromToken(token);

            // 사용자 정보를 상태값에 설정
            console.log(userInfo)
            setUser(userInfo);

            // 서버에 사용자 정보 요청 보내기
            const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/user/info`,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            if (response.ok) {
            const additionalUserInfo = await response.json();
            // 서버에서 받은 추가 정보를 기존 사용자 정보에 합치기
            setUser((prevUserInfo) => ({
                ...prevUserInfo,
                ...additionalUserInfo,
            }));
            } else {
            console.error("Failed to fetch additional user info");
            }
        } else {
            // console.log("No token found, user is not logged in");
        }
        } catch (error) {
        console.error("Error fetching data:", error);
        }
    };

    // userData 함수 실행 (컴포넌트가 마운트될 때 한 번만 실행하도록 빈 배열 전달)
    userData();
    }, []);
    
    useEffect(()=>{console.log(user);},[user])

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
            const roomId = chatRoom.id;
            console.log(roomId);

            stompClient.subscribe('/queue/sendChatRoomIdToClient/' + roomId, (message) => {
                console.log('WebSocket 메세지 수신: ', message.body);
                const receivedMessage = JSON.parse(message.body);
                // 채팅 목록을 업데이트
                setChatRoom(prevChatRoom => ({
                    ...prevChatRoom,
                    chats: [...prevChatRoom.chats, receivedMessage]
                }));
            });
        };

        stompClient.connect({}, onConnect);
        setStompClient(stompClient);

        return () => {
            stompClient.disconnect();
        };
    }, [chatRoom.id]);

    const sendMessageToServer = async (requestData) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/chat/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    const sendMessageButtonClick = async () => {
        if (message.trim().length === 0) {
            return;
        }
    
        const requestData = {
            userId: user.id,
            message: message,
            chatRoomId: chatRoom.id
        };
        console.log(requestData);
    
        try {
            const data = await sendMessageToServer(requestData);
            // 채팅 목록을 업데이트
            setChatRoom(prevChatRoom => ({
                ...prevChatRoom,
                chats: [...prevChatRoom.chats, data]
            }));
            setMessage('');
        } catch (error) {
            // 오류 처리
        }
    };

    return (
        <div>
            <div className='mb-3'>
                <span className='form-control'>{chatRoom.id}</span>
            </div>
            <div className='mb-3'>
                <span className='form-control'>{chatRoom.seller}</span>
            </div>
            <ul>
                {chatRoom.chats.map((message, index) => (
                    <li key={index}>{message.text}</li>
                ))}
            </ul>
            <div style={{ display: "flex", alignItems: "center" }}>
                <input 
                    type="text" 
                    value={message} 
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            sendMessageButtonClick();
                        }
                    }} 
                />
                <button onClick={sendMessageButtonClick}>전송</button>
            </div>
        </div>
    );
};

export default ChatPage;
