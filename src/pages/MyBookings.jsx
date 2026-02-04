import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MY_BOOKINGS } from '../graphql/queries';
import { DELETE_BOOKING, CANCEL_BOOKING } from '../graphql/mutations';
import { Calendar, Clock, Users, MapPin, Edit, Trash2, X } from 'lucide-react';
import EditBookingModal from '../../components/EditBookingModal';

export default function MyBookings() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_MY_BOOKINGS, {
    variables: statusFilter !== 'ALL' ? { status: statusFilter } : {}
  });

  const [deleteBooking] = useMutation(DELETE_BOOKING, {
    onCompleted: () => {
      alert('Booking berhasil dihapus');
      refetch();
    },
    onError: (error) => {
      alert('Error: ' + error.message);
    }
  });

  const [cancelBooking] = useMutation(CANCEL_BOOKING, {
    onCompleted: () => {
      alert('Booking berhasil dibatalkan');
      refetch();
    },
    onError: (error) => {
      alert('Error: ' + error.message);
    }
  });

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus booking ini?')) {
      await deleteBooking({ variables: { id } });
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan booking ini?')) {
      await cancelBooking({ variables: { id } });
    }
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setShowEditModal(true);
  };

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
          <p className="text-red-600 text-lg">Error loading bookings</p>
          <p className="text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  const bookings = data?.myBookings || [];
  const filteredBookings = statusFilter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Menunggu Konfirmasi';
      case 'APPROVED': return 'Disetujui';
      case 'REJECTED': return 'Ditolak';
      case 'CANCELLED': return 'Dibatalkan';
      case 'COMPLETED': return 'Selesai';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Edit Modal */}
      {showEditModal && selectedBooking && (
        <EditBookingModal
          booking={selectedBooking}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBooking(null);
          }}
          onSuccess={() => {
            refetch();
            setShowEditModal(false);
            setSelectedBooking(null);
          }}
        />
      )}

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Pemesanan Saya</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola semua pemesanan ruangan Anda
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status === 'ALL' ? 'Semua' : getStatusText(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Booking</p>
            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <p className="text-sm text-yellow-800">Menunggu</p>
            <p className="text-2xl font-bold text-yellow-900">
              {bookings.filter(b => b.status === 'PENDING').length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <p className="text-sm text-green-800">Disetujui</p>
            <p className="text-2xl font-bold text-green-900">
              {bookings.filter(b => b.status === 'APPROVED').length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4">
            <p className="text-sm text-blue-800">Selesai</p>
            <p className="text-2xl font-bold text-blue-900">
              {bookings.filter(b => b.status === 'COMPLETED').length}
            </p>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Tidak ada pemesanan</p>
            <p className="text-gray-400 text-sm mt-2">
              {statusFilter === 'ALL' 
                ? 'Anda belum memiliki pemesanan' 
                : `Tidak ada pemesanan dengan status ${getStatusText(statusFilter)}`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCancel={handleCancel}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, onEdit, onDelete, onCancel, getStatusColor, getStatusText }) {
  const canEdit = booking.status === 'PENDING' || booking.status === 'APPROVED';
  const canCancel = booking.status === 'PENDING' || booking.status === 'APPROVED';
  const canDelete = booking.status === 'CANCELLED' || booking.status === 'REJECTED';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Room Image */}
        <div className="md:w-48 h-48 md:h-auto">
          <img
            src={booking.room.images?.[0] || 'https://via.placeholder.com/300x200?text=Room'}
            alt={booking.room.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Booking Details */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{booking.room.name}</h3>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin size={14} className="mr-1" />
                <span>{booking.room.location} - Lantai {booking.room.floor}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
              {getStatusText(booking.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex items-center text-gray-700 text-sm mb-2">
                <Calendar size={16} className="mr-2 text-indigo-600" />
                <div>
                  <p className="font-medium">Waktu Mulai</p>
                  <p className="text-gray-600">{formatDate(booking.startTime)}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700 text-sm">
                <Clock size={16} className="mr-2 text-indigo-600" />
                <div>
                  <p className="font-medium">Waktu Selesai</p>
                  <p className="text-gray-600">{formatDate(booking.endTime)}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center text-gray-700 text-sm mb-2">
                <Users size={16} className="mr-2 text-indigo-600" />
                <div>
                  <p className="font-medium">Jumlah Peserta</p>
                  <p className="text-gray-600">{booking.attendees} orang</p>
                </div>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-700">Tujuan</p>
                <p className="text-gray-600 line-clamp-2">{booking.purpose}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Total Biaya</p>
              <p className="text-2xl font-bold text-indigo-600">
                Rp {booking.totalPrice?.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="flex gap-2">
              {canEdit && (
                <button
                  onClick={() => onEdit(booking)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>
              )}
              
              {canCancel && (
                <button
                  onClick={() => onCancel(booking.id)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                >
                  <X size={16} />
                  Batal
                </button>
              )}
              
              {canDelete && (
                <button
                  onClick={() => onDelete(booking.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Hapus
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
