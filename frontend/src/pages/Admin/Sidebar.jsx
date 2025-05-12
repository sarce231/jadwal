import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUsers,
  FaBars,
  FaPhotoVideo,
  FaComment,
  FaTimes,
} from "react-icons/fa";
import io from "socket.io-client";

// Socket koneksi
const socket = io("http://localhost:5000", { transports: ["websocket"] });

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasNewComment, setHasNewComment] = useState(false);
  const location = useLocation();

  // Mendengarkan pesan baru di socket
  useEffect(() => {
    socket.on("new-comment", () => {
      if (location.pathname !== "/admin/dashboard/chat") {
        setHasNewComment(true); // Menandakan ada komentar baru
      }
    });

    // Cleanup listener saat komponen di-unmount
    return () => {
      socket.off("new-comment");
    };
  }, [location]);

  // Reset notifikasi saat membuka halaman komentar
  useEffect(() => {
    if (location.pathname === "/admin/dashboard/chat") {
      setHasNewComment(false); // Reset notifikasi jika user membuka halaman chat
    }
  }, [location]);

  const menuItems = [
    {
      label: "Beranda",
      to: "/admin/dashboard",
      icon: <FaTachometerAlt className="mr-3" />,
    },
    {
      label: "Kelola Jadwal Ibadah",
      to: "/admin/dashboard/auto-schedule-form",
      icon: <FaCalendarAlt className="mr-3" />,
    },
    {
      label: "Media Ibadah",
      to: "/admin/dashboard/media",
      icon: <FaPhotoVideo className="mr-3" />,
    },
    {
      label: (
        <span className="flex items-center relative">
          Komentar
          {hasNewComment && (
            <span className="absolute -top-1 right-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </span>
          )}
        </span>
      ),
      to: "/admin/dashboard/chat",
      icon: <FaComment className="mr-3" />,
    },
    {
      label: "Manajemen Pengguna",
      to: "/admin/dashboard/manajemen-pengguna",
      icon: <FaUsers className="mr-3" />,
    },
  ];

  // Menjaga kontrol sidebar responsif
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Tombol Toggle - Hanya untuk Mobile */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-2 rounded"
      >
        <FaBars />
      </button>

      {/* Overlay - Hanya terlihat saat sidebar dibuka pada mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white shadow-lg z-50 transform transition-transform duration-300
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:block w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-20 bg-gray-900 px-4">
            <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
            {/* Tombol Tutup - Hanya di Mobile */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden text-white"
            >
              <FaTimes />
            </button>
          </div>

          {/* Menu */}
          <ul className="mt-8 space-y-4 px-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.to}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center py-3 px-3 hover:bg-gray-700 rounded-lg transition duration-200 ${
                    location.pathname === item.to ? "bg-gray-700" : ""
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
