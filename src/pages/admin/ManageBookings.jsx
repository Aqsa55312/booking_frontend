import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_BOOKINGS } from '../../graphql/queries';
import { APPROVE_BOOKING, REJECT_BOOKING, DELETE_BOOKING } from '../../graphql/mutations';
import { Calendar, Users, MapPin, Check, X, Trash2, Eye } from 'lucide-react';

export default function ManageBookings() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_ALL_BOOKINGS, {
    variables: statusFilter !== 'ALL' ? { filter: { status: statusFilter } } : {}
  });

  const [approveBooking] = useMutation(APPROVE_BOOKING, {
    onCompleted: () => {
      alert('Booking berhasil disetujui!');
      refetch();
    },
    onError: (error) => alert('Error: ' + error.message)
  });

  const [rejectBooking] = useMutation(REJECT_BOOKING, {
    onCompleted: () => {
      alert('Booking berhasil ditolak!');
      refetch();
    },
    onError: (error) => alert('Error: ' + error.message)
  });

  const [deleteBooking] = useMutation(DELETE_BOOKING, {
    onCompleted: () => {
      alert('Booking berhasil dihapus!');
      refetch();
    },
    onError: (error) => alert('Error: ' + error.message)
  });

  const handleApprove = async (id) => {
    if (window.confirm('Setujui booking ini?')) {
      await approveBooking({ variables: { id } });
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Alasan penolakan (opsional):');
    await rejectBooking({ variables: { id, reason } });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus booking ini?')) {
      await deleteBooking({ variables: { id } });
    }
  };

  const showDetail = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  const bookings = data?.bookings || [];
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

  return (
    <div>
      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedBooking(null);
          }}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Kelola Booking</h2>
        <p className="text-gray-600">Approve, reject, atau hapus booking</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <p className="text-sm text-yellow-800">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">
            {bookings.filter(b => b.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <p className="text-sm text-green-800">Approved</p>
          <p className="text-2xl font-bold text-green-900">
            {bookings.filter(b => b.status === 'APPROVED').length}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4">
          <p className="text-sm text-red-800">Rejected</p>
          <p className="text-2xl font-bold text-red-900">
            {bookings.filter(b => b.status === 'REJECTED').length}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <p className="text-sm text-blue-800">Completed</p>
          <p className="text-2xl font-bold text-blue-900">
            {bookings.filter(b => b.status === 'COMPLETED').length}
          </p>
        </div>
      </div>

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
              {status === 'ALL' ? 'Semua' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ruangan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Waktu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Peserta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.user?.name}</div>
                  <div className="text-sm text-gray-500">{booking.user?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={booking.room?.images?.[0] || 'https://via.placeholder.com/50'}
                      alt={booking.room?.name}
                      className="w-10 h-10 rounded object-cover mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.room?.name}</div>
                      <div className="text-sm text-gray-500">{booking.room?.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(booking.startTime).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(booking.startTime).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - {new Date(booking.endTime).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.attendees} orang
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Rp {booking.totalPrice?.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => showDetail(booking)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Detail"
                    >
                      <Eye size={18} />
                    </button>
                    {booking.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleApprove(booking.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(booking.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada booking</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BookingDetailModal({ booking, onClose }) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Detail Booking</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Informasi Pemesan</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm"><span className="font-medium">Nama:</span> {booking.user?.name}</p>
              <p className="text-sm mt-2"><span className="font-medium">Email:</span> {booking.user?.email}</p>
            </div>
          </div>

          {/* Room Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Informasi Ruangan</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <img
                  src={booking.room?.images?.[0] || 'https://via.placeholder.com/100'}
                  alt={booking.room?.name}
                  className="w-20 h-20 rounded object-cover mr-4"
                />
                <div>
                  <p className="font-medium text-gray-900">{booking.room?.name}</p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin size={14} className="mr-1" />
                    {booking.room?.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Detail Pemesanan</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start">
                <Calendar size={18} className="mr-3 text-indigo-600 mt-1" />
                <div>
                  <p className="text-sm font-medium">Waktu Mulai</p>
                  <p className="text-sm text-gray-600">{formatDate(booking.startTime)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar size={18} className="mr-3 text-indigo-600 mt-1" />
                <div>
                  <p className="text-sm font-medium">Waktu Selesai</p>
                  <p className="text-sm text-gray-600">{formatDate(booking.endTime)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Users size={18} className="mr-3 text-indigo-600 mt-1" />
                <div>
                  <p className="text-sm font-medium">Jumlah Peserta</p>
                  <p className="text-sm text-gray-600">{booking.attendees} orang</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Tujuan/Keperluan</p>
                <p className="text-sm text-gray-600">{booking.purpose}</p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total Biaya</span>
              <span className="text-2xl font-bold text-indigo-600">
                Rp {booking.totalPrice?.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
