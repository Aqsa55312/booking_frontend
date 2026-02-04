import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_ROOMS } from '../graphql/queries';
import { Calendar, Users, MapPin, Search, Filter, Grid, List } from 'lucide-react';

export default function Rooms() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [statusFilter, setStatusFilter] = useState('AVAILABLE');

  const { loading, error, data } = useQuery(GET_ROOMS, {
    variables: {
      filter: {
        status: statusFilter,
        minCapacity: capacityFilter ? parseInt(capacityFilter) : null
      }
    }
  });

  const filteredRooms = data?.rooms?.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error loading rooms</p>
          <p className="text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ruangan Tersedia</h1>
              <p className="mt-1 text-sm text-gray-600">
                Pilih ruangan yang sesuai dengan kebutuhan Anda
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari ruangan atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <select
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Semua Kapasitas</option>
                <option value="10">Min 10 orang</option>
                <option value="20">Min 20 orang</option>
                <option value="50">Min 50 orang</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="AVAILABLE">Tersedia</option>
                <option value="ALL">Semua Status</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Ditemukan <span className="font-semibold">{filteredRooms.length}</span> ruangan
          </p>
        </div>

        {/* Rooms Grid/List */}
        {filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Tidak ada ruangan yang ditemukan</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} navigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRooms.map((room) => (
              <RoomListItem key={room.id} room={room} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Room Card Component (Grid View)
function RoomCard({ room, navigate }) {
  return (
    <div 
      onClick={() => navigate(`/dashboard/rooms/${room.id}`)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
    >
      <div className="relative h-48">
        <img
          src={room.images?.[0] || 'https://via.placeholder.com/400x300?text=Room'}
          alt={room.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            room.status === 'AVAILABLE' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {room.status === 'AVAILABLE' ? 'Tersedia' : 'Tidak Tersedia'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Users size={16} className="mr-2" />
            <span className="text-sm">Kapasitas: {room.capacity} orang</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-2" />
            <span className="text-sm">{room.location} - Lantai {room.floor}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-indigo-600">
              Rp {room.pricePerHour?.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-gray-500">per jam</p>
          </div>
          <button 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/rooms/${room.id}`);
            }}
          >
            Booking
          </button>
        </div>
      </div>
    </div>
  );
}

// Room List Item Component (List View)
function RoomListItem({ room, navigate }) {
  return (
    <div 
      onClick={() => navigate(`/dashboard/rooms/${room.id}`)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64 h-48 md:h-auto">
          <img
            src={room.images?.[0] || 'https://via.placeholder.com/400x300?text=Room'}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{room.name}</h3>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm">{room.location} - Lantai {room.floor}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              room.status === 'AVAILABLE' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {room.status === 'AVAILABLE' ? 'Tersedia' : 'Tidak Tersedia'}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{room.description}</p>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center text-gray-600">
              <Users size={16} className="mr-2" />
              <span className="text-sm">Kapasitas: {room.capacity} orang</span>
            </div>
            {room.facilities && (
              <div className="flex gap-2">
                {room.facilities.slice(0, 3).map((facility, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {facility}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div>
              <p className="text-3xl font-bold text-indigo-600">
                Rp {room.pricePerHour?.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-gray-500">per jam</p>
            </div>
            <button 
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/dashboard/rooms/${room.id}`);
              }}
            >
              Booking Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
