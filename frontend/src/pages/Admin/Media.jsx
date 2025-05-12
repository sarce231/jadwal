import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const Media = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/media`);
      setMediaList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching media');
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedLink = (url) => {
    if (!url) return '';
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setType(selectedFile.type);
    setPreview(URL.createObjectURL(selectedFile));
    setLink('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!name || (!file && !link)) {
      setError('Name and either file or link is required');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    if (file) {
      formData.append('media', file);
    } else if (link) {
      const embedLink = getYouTubeEmbedLink(link.trim());
      formData.append('link', embedLink);
      formData.append('type', 'link');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/media`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMediaList((prevList) => [response.data, ...prevList]);
      setName('');
      setType('');
      setFile(null);
      setLink('');
      setPreview(null);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/media/${id}`);
      setMediaList((prevList) => prevList.filter((media) => media._id !== id));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete media');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-lg">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Media Ibadah</h1>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <form onSubmit={handleUpload} className="bg-white shadow-lg rounded-lg p-6 mb-6 border">
        <h2 className="text-lg font-semibold mb-4">Upload Media atau Link</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full mb-3 border p-2 rounded"
        />
        <input
          type="text"
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
            setFile(null);
            setPreview(null);
            setType('link');
          }}
          placeholder="Link YouTube"
          className="w-full p-2 mb-3 border rounded"
        />
        {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover mx-auto my-3 rounded-lg shadow-md" />}
        <button type="submit" disabled={uploading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mediaList.length > 0 ? (
          mediaList.map((media) => {
            const isYouTube = media.link?.includes("youtube.com/embed/");
            const isSoundCloud = media.link?.includes("soundcloud.com");
            const mediaUrl = media.url?.startsWith("http") ? media.url : `${API_BASE_URL}${media.url}`;

            return (
              <div key={media._id} className="p-4 border rounded-lg shadow-md flex flex-col items-center">
                <p className="text-sm font-medium text-gray-800">{media.name}</p>
                <p className="text-xs text-gray-500 mb-2">{media.type}</p>

                {media.link && isYouTube ? (
                  <iframe
                    width="100%"
                    height="200"
                    src={media.link}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={media.name}
                    className="rounded-lg shadow-md mb-2"
                  ></iframe>
                ) : media.link && isSoundCloud ? (
                  <iframe
                    width="100%"
                    height="166"
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(media.link)}&color=%23ff5500`}
                    title={media.name}
                    className="rounded-lg shadow-md mb-2"
                  ></iframe>
                ) : media.link ? (
                  <a href={media.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Open Link
                  </a>
                ) : media.type?.startsWith("image/") ? (
                  <img src={mediaUrl} alt={media.name} className="w-40 h-40 object-cover rounded-lg shadow-md mb-2" />
                ) : media.type?.startsWith("video/") ? (
                  <video controls className="w-40 h-40 rounded-lg shadow-md mb-2">
                    <source src={mediaUrl} type={media.type} />
                    Your browser does not support the video tag.
                  </video>
                ) : media.type?.startsWith("audio/") ? (
                  <audio controls className="w-full mb-2">
                    <source src={mediaUrl} type={media.type} />
                    Your browser does not support the audio tag.
                  </audio>
                ) : (
                  <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Download File
                  </a>
                )}

                <div className="flex gap-3 mt-2">
                  {(media.link || media.url) && (
                    <a href={media.link || mediaUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                      View
                    </a>
                  )}
                  <button onClick={() => handleDelete(media._id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">No media available</p>
        )}
      </div>
    </div>
  );
};

export default Media;
