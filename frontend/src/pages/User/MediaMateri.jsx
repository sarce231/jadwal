import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5000"; // Ganti jika perlu

const MediaMateri = () => {
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/media`);
        const data = await resp.json();
        setMediaList(Array.isArray(data) ? data : []);

        await fetch(`${API_BASE_URL}/api/media/mark-read-all`, {
          method: "PATCH",
        });
      } catch (err) {
        console.error("Error fetching or marking media:", err);
      }
    };

    init();
  }, []);

  // Fungsi untuk mengecek apakah URL adalah link YouTube
  const isYouTubeUrl = (url) => {
    const regex = /^https?:\/\/(www\.)?(youtube|youtu|vimeo)\.(com|be)\/(watch\?v=|embed\/)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
          Media & Materi
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Daftar materi yang tersedia untuk dilihat langsung.
        </p>
      </div>

      {mediaList.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {mediaList.map((media) => {
            // Pastikan media.url ada dan tidak null
            const mediaUrl = media.url && media.url.startsWith("http")
              ? media.url
              : `${API_BASE_URL}${media.url}`;

            return (
              <div
                key={media._id}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition"
              >
                <div className="flex items-center justify-center p-2">
                  {/* Cek apakah media adalah video YouTube */}
                  {mediaUrl && isYouTubeUrl(mediaUrl) ? (
                    <iframe
                      width="100%"
                      height="200"
                      src={`https://www.youtube.com/embed/${mediaUrl.split('v=')[1]}`}
                      title={media.title || media.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : media.type?.startsWith("image/") ? (
                    <img
                      src={mediaUrl}
                      alt={media.title}
                      className="w-40 h-40 object-cover rounded shadow"
                    />
                  ) : media.type?.startsWith("video/") ? (
                    <video
                      src={mediaUrl}
                      controls
                      className="w-40 h-40 object-cover rounded shadow"
                    />
                  ) : (
                    <div className="text-gray-600 dark:text-gray-300 text-sm text-center">
                      Pratinjau tidak tersedia
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {media.title || media.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm h-16 overflow-hidden">
                    {media.description || "Tidak ada deskripsi"}
                  </p>
                  <div className="flex justify-between items-center">
                    <a
                      href={mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg shadow"
                    >
                      Lihat
                    </a>
                    <a
                      href={mediaUrl}
                      download
                      className="inline-block px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg shadow"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Tidak ada media yang tersedia.
        </p>
      )}
    </div>
  );
};

export default MediaMateri;
