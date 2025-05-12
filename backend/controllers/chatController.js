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

    console.log('Message saved, but not emitting in controller');

    // Kirim response ke client
    res.status(200).json(chat);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ message: "Error sending message" });
  }
};

// Endpoint untuk menghapus pesan
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.body;

    // Menghapus pesan dari database
    const chat = await Chat.findOneAndUpdate(
      { name: 'default' },
      { $pull: { messages: { _id: messageId } } },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat tidak ditemukan" });
    }

    console.log('Message deleted, but not emitting in controller');

    // Kirim response ke client
    res.status(200).json(chat);
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ message: "Error deleting message" });
  }
};
