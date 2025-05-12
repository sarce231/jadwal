// import { useEffect, useState } from 'react';

// const Notification = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/notifications');
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         if (Array.isArray(data)) {
//           setNotifications(data);
//         } else {
//           throw new Error('Data yang diterima bukan array');
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

//   return (
//     <div className="p-6 bg-white shadow-md rounded-lg">
//       <h2 className="text-2xl font-bold mb-4">Daftar Notifikasi</h2>
//       {notifications.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border border-gray-200">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="py-2 px-4 border">No</th>
//                 <th className="py-2 px-4 border">Pesan</th>
//                 <th className="py-2 px-4 border">Tanggal</th>
//               </tr>
//             </thead>
//             <tbody>
//               {notifications.map((notif, index) => (
//                 <tr key={index} className="text-center border-t">
//                   <td className="py-2 px-4 border">{index + 1}</td>
//                   <td className="py-2 px-4 border">{notif.message}</td>
//                   <td className="py-2 px-4 border">{new Date(notif.createdAt).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <p className="text-gray-500 mt-4">Tidak ada notifikasi.</p>
//       )}
//     </div>
//   );
// };

// export default Notification;
