import React from "react";
import { Link } from "react-router-dom";
import {
  FaSignInAlt,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClipboardList,
  FaComments,
  FaCheckCircle,
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        id="hero"
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 text-white px-6 py-12"
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center px-6 lg:px-20">
          {/* Text Section */}
          <div className="text-left md:w-1/2 space-y-6">
            <h1 className="text-2xl sm:text-5xl font-extrabold text-white">
              Selamat Datang di <br />
              <span className="text-yellow-400">Sistem Pelayanan Ibadah </span>
              <br />
              Persekutuan Pelajar
            </h1>
            <p className="text-gray-300 text-lg">
              Sistem ini dibuat untuk membantu para pelayan agar dapat membantu dalam proses pelayanan ibadah.
            </p>
            <div className="flex space-x-4 mt-6">
              <Link
                to="/login"
                className="flex items-center bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-800 transition transform hover:scale-105 duration-300"
              >
                <FaSignInAlt className="mr-2" /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-800 transition transform hover:scale-105 duration-300"
              >
                <FaUser className="mr-2" /> Buat Akun
              </Link>
            </div>
          </div>
          {/* Image Section */}
          <div className="md:w-1/2 mt-10 md:mt-2">
            <img
              src="/images/perse.jpg"
              alt="Hubungan Industrial"
              className="w-full max-w-md mx-auto transform hover:scale-105 transition duration-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Layanan Section */}
      <section id="layanan" className="container mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">Layanan Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <FaClipboardList className="text-blue-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Jadwal Lengkap</h3>
            <p className="text-gray-600 dark:text-gray-300">Lihat jadwal pelayanan ibadah terbaru.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <FaComments className="text-blue-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interaksi Jemaat</h3>
            <p className="text-gray-600 dark:text-gray-300">Dapatkan informasi ibadah secara langsung.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <FaCheckCircle className="text-blue-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Pelayanan Optimal</h3>
            <p className="text-gray-600 dark:text-gray-300">Kami siap melayani kebutuhan ibadah Anda.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontak" className="bg-blue-700 text-white py-16 px-6 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold mb-12">Hubungi Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <FaMapMarkerAlt className="text-4xl mb-4 text-yellow-400" />
              <h3 className="text-lg font-semibold mb-2">Alamat</h3>
              <p className="text-gray-300 text-center">Kompleks Kantor Bupati Raja Ampat</p>
            </div>
            <div className="flex flex-col items-center">
              <FaEnvelope className="text-4xl mb-4 text-yellow-400" />
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-300">info@hubunganindustrial.id</p>
            </div>
            <div className="flex flex-col items-center">
              <FaPhoneAlt className="text-4xl mb-4 text-yellow-400" />
              <h3 className="text-lg font-semibold mb-2">Telepon</h3>
              <p className="text-gray-300">+62 21 12345678</p>
            </div>
          </div>
        </div>

        {/* Kontak
      <section id="kontak" className="container mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Hubungi Kami</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Email: info@pelayananibadah.com | Telepon: 0812-3456-7890
        </p>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} Pelayanan Ibadah. All Rights Reserved.</p>
      </footer> */} 



      </section>
    </div>
  );
};

export default Home;
