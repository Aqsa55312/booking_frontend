import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-indigo-600">Dashboard User</h1>
              <div className="flex gap-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">
                  Home
                </Link>
                <Link to="/dashboard/rooms" className="text-gray-700 hover:text-indigo-600">
                  Ruangan
                </Link>
                <Link to="/dashboard/bookings" className="text-gray-700 hover:text-indigo-600">
                  Pemesanan Saya
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Halo, {user?.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<DashboardHome user={user} />} />
          <Route path="/rooms" element={<div>Daftar Ruangan (Coming Soon)</div>} />
          <Route path="/bookings" element={<div>Pemesanan Saya (Coming Soon)</div>} />
        </Routes>
      </div>
    </div>
  );
};

const DashboardHome = ({ user }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Selamat Datang, {user?.name}!
      </h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl mb-2">📅</div>
          <h3 className="text-xl font-semibold mb-2">Booking Aktif</h3>
          <p className="text-3xl font-bold text-indigo-600">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl mb-2">✅</div>
          <h3 className="text-xl font-semibold mb-2">Selesai</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl mb-2">⏳</div>
          <h3 className="text-xl font-semibold mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">0</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/dashboard/rooms"
            className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition"
          >
            <div className="text-2xl mb-2">🏢</div>
            <h4 className="font-semibold">Lihat Ruangan</h4>
            <p className="text-sm text-gray-600">Browse ruangan yang tersedia</p>
          </Link>
          
          <Link
            to="/dashboard/bookings"
            className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition"
          >
            <div className="text-2xl mb-2">📋</div>
            <h4 className="font-semibold">Pemesanan Saya</h4>
            <p className="text-sm text-gray-600">Lihat riwayat booking</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
