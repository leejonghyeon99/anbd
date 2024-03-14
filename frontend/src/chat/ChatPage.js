import React, { useEffect } from 'react';
import ChatComponent from './component/ChatComponent';
import { useLocation } from 'react-router-dom';

const ChatPage = () => {

    const location = useLocation();
    const product = location.state.product;

    return (
        <div>
            <ChatComponent product={product}></ChatComponent>
        </div>
    );
};

export default ChatPage;