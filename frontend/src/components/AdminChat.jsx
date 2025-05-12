// src/components/AdminChat.js
import React, { useEffect, useState, useRef } from 'react';
import socket from '../socket';  // Mengimpor koneksi WebSocket

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  const senderName = localStorage.getItem('userName') || 'Admin';

  useEffect(() => {
    localStorage.setItem('chatOpen', 'true');

    socket.on('initialMessages', handleInitialMessages);
    socket.on('newMessage', handleNewMessage);
    socket.on('deletedMessage', handleDeletedMessage);

    return () => {
      localStorage.setItem('chatOpen', 'false');

      socket.off('initialMessages', handleInitialMessages);
      socket.off('newMessage', handleNewMessage);
      socket.off('deletedMessage', handleDeletedMessage);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInitialMessages = (data) => {
    setMessages(data);
  };

  const handleNewMessage = (data) => {
    setMessages((prev) => [...prev, data]);
    if (data.sender === 'user') {
      setHasNewMessage(true);
      socket.emit('new-comment', data);
    }
  };

  const handleDeletedMessage = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const handleScroll = () => {
    const isAtBottom =
      chatBoxRef.current.scrollTop + chatBoxRef.current.clientHeight >=
      chatBoxRef.current.scrollHeight - 10;

    if (isAtBottom) {
      setHasNewMessage(false);
    }
  };

  const handleInputChange = (e) => {
    setReply(e.target.value);
    setHasNewMessage(false);
  };

  const sendReply = () => {
    if (!reply.trim()) return;

    const newMessage = {
      sender: 'admin',
      userName: senderName,
      text: reply,
      timestamp: new Date().toISOString(),
      id: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    socket.emit('sendMessage', newMessage);
    setReply('');
    setHasNewMessage(false);
  };

  const deleteMessage = (messageId) => {
    socket.emit('deleteMessage', { messageId });
  };

  return (
    <div>
      <h3>
        Chat dengan User{' '}
        {hasNewMessage && <span style={{ color: 'red' }}>🔴 Pesan baru</span>}
      </h3>

      <div
        ref={chatBoxRef}
        onScroll={handleScroll}
        style={{
          height: 300,
          overflowY: 'auto',
          border: '1px solid gray',
          padding: '10px',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: '10px',
              textAlign: msg.sender === 'admin' ? 'right' : 'left',
            }}
          >
            <p>
              <strong>
                {msg.userName || (msg.sender === 'admin' ? 'Admin' : 'User')}:
              </strong>{' '}
              {msg.text}
            </p>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            {msg.sender === 'admin' && (
              <button
                onClick={() => deleteMessage(msg.id)}
                style={{
                  marginLeft: '10px',
                  padding: '5px',
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                }}
              >
                Hapus
              </button>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <input
        type="text"
        value={reply}
        onChange={handleInputChange}
        placeholder="Balas komentar..."
        style={{ width: '100%', padding: '10px', marginTop: '10px' }}
      />
      <button onClick={sendReply} style={{ padding: '10px', marginTop: '10px' }}>
        Balas
      </button>
    </div>
  );
};

export default AdminChat;
