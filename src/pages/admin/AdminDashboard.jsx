import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <div className="flex gap-4">
                <Link to="/admin" className="hover:text-indigo-200">
                  Home
                </Link>
                <Link to="/admin/users" className="hover:text-indigo-200">
                  Users
                </Link>
                <Link to="/admin/rooms" className="hover:text-indigo-200">
                  Rooms
                </Link>
                <Link to="/admin/bookings" className="hover:text-indigo-200">
                  Bookings
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>Admin: {user?.name}</span>
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
          <Route path="/" element={<AdminHome />} />
          <Route path="/users" element={<div>User Management (Coming Soon)</div>} />
          <Route path="/rooms" element={<div>Room Management (Coming Soon)</div>} />
          <Route path="/bookings" element={<div>Booking Management (Coming Soon)</div>} />
        </Routes>
      </div>
    </div>
  );
};

const AdminHome = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Admin Dashboard
      </h2>
      
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-indigo-600">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl mb-2">🏢</div>
          <h3 className="text-lg font-semibold mb-2">Total Rooms</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl mb-2">📅</div>
          <h3 className="text-lg font-semibold mb-2">Active Bookings</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl mb-2">⏳</div>
          <h3 className="text-lg font-semibold mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">0</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/admin/users"
            className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition"
          >
            <div className="text-2xl mb-2">👥</div>
            <h4 className="font-semibold">Manage Users</h4>
            <p className="text-sm text-gray-600">Add, edit, or remove users</p>
          </Link>
          
          <Link
            to="/admin/rooms"
            className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition"
          >
            <div className="text-2xl mb-2">🏢</div>
            <h4 className="font-semibold">Manage Rooms</h4>
            <p className="text-sm text-gray-600">Add, edit, or remove rooms</p>
          </Link>
          
          <Link
            to="/admin/bookings"
            className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition"
          >
            <div className="text-2xl mb-2">📋</div>
            <h4 className="font-semibold">Approve Bookings</h4>
            <p className="text-sm text-gray-600">Review and approve bookings</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
