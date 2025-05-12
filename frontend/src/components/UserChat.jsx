import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', { transports: ['websocket'] });

const UserChat = ({ onNewMessage }) => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const [userName, setUserName] = useState('');

  // ✅ Auto reload saat pertama masuk halaman chat
  useEffect(() => {
    if (!sessionStorage.getItem('userChatReloaded')) {
      sessionStorage.setItem('userChatReloaded', 'true');
      window.location.reload();
    }
  }, []);

  // 🔁 Hapus flag saat keluar dari halaman agar reload bisa terjadi lagi nanti
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('userChatReloaded');
    };
  }, []);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo?.name) setUserName(userInfo.name);

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('initialMessages', (data) => {
      if (data.length === 0) {
        setMessages([{ userName: 'System', text: 'Belum ada pesan.' }]);
      } else {
        setMessages(data);
      }
    });

    socket.on('newMessage', (data) => {
      setMessages((prev) => [...prev, data]);
      if (data.sender === 'admin') {
        if (onNewMessage) onNewMessage();
      }
    });

    return () => {
      socket.off('initialMessages');
      socket.off('newMessage');
    };
  }, [onNewMessage]);

  const sendMessage = () => {
    if (!msg.trim()) return;

    const message = {
      sender: 'user',
      userName,
      text: msg,
      timestamp: new Date().toISOString(),
    };

    socket.emit('sendMessage', message);
    setMsg('');
  };

  return (
    <div>
      <h3>Komentar User</h3>
      <div style={{ height: 200, overflowY: 'auto', border: '1px solid gray', padding: 10 }}>
        {messages.map((message, index) => (
          <div key={index} style={{ textAlign: message.sender === 'user' ? 'left' : 'right' }}>
            <p><strong>{message.userName}:</strong> {message.text}</p>
            <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Tulis komentar..."
        style={{ width: '100%', padding: '10px', marginTop: '10px' }}
      />
      <button onClick={sendMessage} style={{ padding: '10px', marginTop: '10px' }}>
        Kirim
      </button>
    </div>
  );
};

export default UserChat;
