import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String }, // Tidak wajib (jika media berupa link)
  link: { type: String }, // Link eksternal (YouTube, SoundCloud, dll)
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now }
});

const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);

export default Media;
