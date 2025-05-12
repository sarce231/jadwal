import { Server } from 'socket.io';
import Chat from '../models/Chat.js';

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Kirim pesan awal saat client connect
    Chat.findOne({ name: 'default' })
      .then(chat => {
        socket.emit('initialMessages', chat?.messages || []);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        socket.emit('initialMessages', []);
      });

    // Saat menerima pesan baru
    socket.on('sendMessage', async (msg) => {
      const message = {
        sender: msg.sender,
        userName: msg.userName,
        text: msg.text,
        timestamp: new Date().toISOString(),
      };

      try {
        await Chat.findOneAndUpdate(
          { name: 'default' },
          { $push: { messages: message } },
          { new: true, upsert: true }
        );

        io.emit('newMessage', message); // Broadcast ke semua client
      } catch (err) {
        console.error('Send error:', err);
        socket.emit('messageError', 'Failed to send message');
      }
    });

    // Hapus pesan
    socket.on('deleteMessage', async ({ messageId }) => {
      try {
        const chat = await Chat.findOneAndUpdate(
          { name: 'default' },
          { $pull: { messages: { _id: messageId } } },
          { new: true }
        );

        if (chat) {
          io.emit('deletedMessage', messageId); // Emit ke semua klien
        }
      } catch (err) {
        console.error('Delete error:', err);
        socket.emit('messageError', 'Failed to delete message');
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
