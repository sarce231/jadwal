import Media from '../models/Media.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Setup __dirname untuk ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Upload media
export const uploadMedia = async (req, res) => {
  try {
    const { name, type, link } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Nama dan tipe media wajib diisi.' });
    }

    let filePath = null;

    if (req.file) {
      const file = req.file;
      const allowedTypes = [
        'image/png', 'image/jpeg', 'image/jpg', 'application/pdf',
        'video/mp4', 'video/mpeg', 'video/quicktime',
        'audio/mpeg', 'audio/wav', 'audio/ogg'
      ];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ message: 'Tipe file tidak valid.' });
      }

      filePath = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    }

    if (!filePath && !link) {
      return res.status(400).json({ message: 'Harus menyertakan file atau link.' });
    }

    const newMedia = new Media({
      name,
      type,
      url: filePath || null,
      link: link || null,
      isRead: false
    });

    await newMedia.save();
    res.status(201).json(newMedia);
  } catch (err) {
    console.error('Gagal mengunggah media:', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat mengunggah media.' });
  }
};

// Ambil semua media
export const getAllMedia = async (req, res) => {
  try {
    const media = await Media.find();
    res.status(200).json(media);
  } catch (err) {
    console.error('Gagal mengambil media:', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat mengambil media.' });
  }
};

// Hapus media
export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({ message: 'Media tidak ditemukan.' });
    }

    if (media.url) {
      const filePath = path.join(__dirname, '..', 'uploads', path.basename(media.url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Media.findByIdAndDelete(id);
    res.status(200).json({ message: 'Media berhasil dihapus.' });
  } catch (err) {
    console.error('Gagal menghapus media:', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat menghapus media.' });
  }
};
