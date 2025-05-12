
import React, { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import axios from "axios";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const bellRef = useRef();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    // Fungsi fetch notifikasi

    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/notifications'); // ganti dengan API kamu
        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error('Gagal mengambil notifikasi:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <FaBell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-2 font-semibold border-b dark:border-gray-600">
            Notifikasi
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <li
                  key={notif._id || notif.id}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  {notif.message || notif.text}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">Tidak ada notifikasi</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
