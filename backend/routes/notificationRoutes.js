const express = require('express');
const Notification = require('../models/notification'); // Import model

const router = express.Router();

// GET: Ambil semua notifikasi dari database
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find(); // Ambil semua notifikasi
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil notifikasi', error: err.message });
  }
});

// POST: Tambah notifikasi baru
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const newNotification = new Notification({ message });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambahkan notifikasi', error: err.message });
  }
});

module.exports = router;
