import { io } from '../server.js'; // Sesuaikan dengan jalur file server.js Anda
import Chat from '../models/Chat.js'; // Sesuaikan dengan model Chat Anda

// Endpoint untuk mendapatkan semua chat
export const getAllChat = async (req, res) => {
  try {
    const chat = await Chat.find();
    res.status(200).json(chat);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ message: "Gagal mengambil chat: " + err.message });
  }
};

// Endpoint untuk mengirim pesan
export const sendMessage = async (req, res) => {
  try {
    const { sender, userName, text } = req.body;

    // Simpan pesan ke database
    const message = { sender, userName, text, timestamp: new Date().toISOString() };
    const chat = await Chat.findOneAndUpdate(
      { name: 'default' },
      { $push: { messages: message } },
      { new: true, upsert: true }
    );

    console.log('Message saved, emitting to clients:', message);

    // Kirim pesan ke semua klien melalui socket.io
    io.emit('newMessage', message);  // Emit pesan ke semua klien

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ message: "Error sending message" });
  }
};

// Endpoint untuk menghapus pesan
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.body; // Mengambil ID pesan yang ingin dihapus

    // Menghapus pesan dari database
    const chat = await Chat.findOneAndUpdate(
      { name: 'default' },
      { $pull: { messages: { _id: messageId } } },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat tidak ditemukan" });
    }

    console.log('Message deleted, emitting to clients:', messageId);

    // Emit event ke semua klien untuk menghapus pesan
    io.emit('deletedMessage', messageId); // Emit event 'deletedMessage' untuk memberi tahu klien

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ message: "Error deleting message" });
  }
};
