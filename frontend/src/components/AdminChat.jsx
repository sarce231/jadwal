import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', { transports: ['websocket'] });

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  const senderName = localStorage.getItem('userName') || 'Admin';

  // ✅ Reload otomatis setiap kali admin membuka halaman chat
  useEffect(() => {
    if (!sessionStorage.getItem('reloadedChat')) {
      sessionStorage.setItem('reloadedChat', 'true');
      window.location.reload();
    }
  }, []);

  // 🔁 Bersihkan flag saat keluar dari halaman agar reload terjadi lagi nanti
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('reloadedChat');
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('chatOpen', 'true');

    socket.on('initialMessages', (data) => {
      setMessages(data);
    });

    socket.on('newMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      if (data.sender === 'user') {
        setHasNewMessage(true);
        socket.emit('new-comment', data);
      }
    });

    socket.on('deletedMessage', (messageId) => {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId)
      );
    });

    return () => {
      localStorage.setItem('chatOpen', 'false');
      socket.off('initialMessages');
      socket.off('newMessage');
      socket.off('deletedMessage');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleScroll = () => {
    const isAtBottom =
      chatBoxRef.current.scrollHeight ===
      chatBoxRef.current.scrollTop + chatBoxRef.current.clientHeight;
    if (isAtBottom) {
      setHasNewMessage(false);
    }
  };

  const sendReply = () => {
    if (!reply.trim()) return;

    const message = {
      sender: 'admin',
      userName: senderName,
      text: reply,
      timestamp: new Date().toISOString(),
    };

    socket.emit('sendMessage', message);
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
        {messages.map((message) => (
          <div
            key={message._id}
            style={{
              marginBottom: '10px',
              textAlign: message.sender === 'admin' ? 'right' : 'left',
            }}
          >
            <p>
              <strong>
                {message.userName || (message.sender === 'admin' ? 'Admin' : 'User')}
              </strong>
              : {message.text}
            </p>
            <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
            {message.sender === 'admin' && (
              <button
                onClick={() => deleteMessage(message._id)}
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
        onChange={(e) => setReply(e.target.value)}
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
