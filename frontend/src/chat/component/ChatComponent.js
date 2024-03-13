import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [roomId, setRoomId] = useState(1);
  const [stompClient, setStompClient] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log('WebSocket Connected:', frame);
      setStompClient(client);

      // 원하는 방에 구독
        client.subscribe(`/send/${roomId}`, (message) => {
        const receivedMessage = message.body;
        console.log(receivedMessage)
        setChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
      
      // 성공적으로 구독했을 때 로그 출력
      console.log(`/room/${roomId} 구독 성공적으로 완료됨`);
    };

    client.onStompError = (frame) => {
      console.error('STOMP 에러:', frame);
    };

    client.activate();

    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, [roomId]);

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      const token = localStorage.getItem("accessToken"); // 실제 토큰 값으로 교체해야 합니다.
      console.log(token)
      stompClient.publish({
        destination: `/room/${roomId}`,
        body: message,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('');
    } else {
      console.error('STOMP 연결이 활성화되지 않았습니다.');
    }
  };

  return (
    <div>
      <div>
        {chatMessages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default ChatComponent;