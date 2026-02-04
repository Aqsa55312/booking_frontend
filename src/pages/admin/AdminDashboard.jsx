import { Routes, Route, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useAuth } from '../../context/AuthContext';
import { GET_ADMIN_STATS } from '../../graphql/queries';
import ManageRooms from './ManageRooms';
import ManageBookings from './ManageBookings';

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
                <Link to="/admin/rooms" className="hover:text-indigo-200">
                  Ruangan
                </Link>
                <Link to="/admin/bookings" className="hover:text-indigo-200">
                  Booking
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
          <Route path="/rooms" element={<ManageRooms />} />
          <Route path="/bookings" element={<ManageBookings />} />
        </Routes>
      </div>
    </div>
  );
};

const AdminHome = () => {
  const { loading, error, data } = useQuery(GET_ADMIN_STATS);

  const stats = data?.adminStats || {
    totalUsers: 0,
    totalRooms: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeBookings: 0,
    availableRooms: 0,
    occupancyRate: 0
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Admin Dashboard
      </h2>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="text-lg font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-3xl mb-2">🏢</div>
              <h3 className="text-lg font-semibold mb-2">Total Ruangan</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalRooms}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="text-lg font-semibold mb-2">Active Bookings</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.activeBookings}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-3xl mb-2">⏳</div>
              <h3 className="text-lg font-semibold mb-2">Pending Approval</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingApprovals}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow">
              <h3 className="text-sm font-medium mb-2 opacity-90">Total Revenue</h3>
              <p className="text-2xl font-bold">Rp {stats.totalRevenue?.toLocaleString('id-ID')}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-xl shadow">
              <h3 className="text-sm font-medium mb-2 opacity-90">Available Rooms</h3>
              <p className="text-2xl font-bold">{stats.availableRooms}</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-xl shadow">
              <h3 className="text-sm font-medium mb-2 opacity-90">Occupancy Rate</h3>
              <p className="text-2xl font-bold">{stats.occupancyRate}%</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 rounded-xl shadow">
              <h3 className="text-sm font-medium mb-2 opacity-90">Total Bookings</h3>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/admin/rooms"
                className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition"
              >
                <div className="text-2xl mb-2">🏢</div>
                <h4 className="font-semibold">Manage Ruangan</h4>
                <p className="text-sm text-gray-600">Tambah, edit, atau hapus ruangan</p>
              </Link>
              
              <Link
                to="/admin/bookings"
                className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition"
              >
                <div className="text-2xl mb-2">📅</div>
                <h4 className="font-semibold">Manage Booking</h4>
                <p className="text-sm text-gray-600">Approve, reject, atau hapus booking</p>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
