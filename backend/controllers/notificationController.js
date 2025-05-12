const Notification = require('./models/Notification');


// Tambah notifikasi ke database
exports.addNotification = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const newNotification = new Notification({ message });
    await newNotification.save();

    res.status(201).json(newNotification);
  } catch (err) {
    console.error("Error saving notification:", err);
    res.status(500).json({ message: err.message });
  }
};

// Ambil semua notifikasi dari database
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: err.message });
  }
};

// Tandai notifikasi sebagai sudah dibaca
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id, 
      { status: 'read' }, 
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json(notification);
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ message: err.message });
  }
};


// const Notification = require('../models/Notification');

// // Add notification
// exports.addNotification = async (req, res) => {
//   try {
//     const { message } = req.body;
//     const newNotification = new Notification({
//       message
//     });

//     await newNotification.save();
//     res.status(201).json(newNotification);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get all notifications
// exports.getNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find().sort({ createdAt: -1 });
//     res.status(200).json(notifications);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Mark notification as read
// exports.markAsRead = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const notification = await Notification.findByIdAndUpdate(id, { status: 'read' }, { new: true });
    
//     if (!notification) {
//       return res.status(404).json({ message: 'Notification not found' });
//     }

//     res.status(200).json(notification);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
