import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ROOM_BY_ID } from '../graphql/queries';
import { CREATE_BOOKING } from '../graphql/mutations';
import { Calendar, Users, MapPin, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const { loading, error, data } = useQuery(GET_ROOM_BY_ID, {
    variables: { id }
  });

  const [createBooking, { loading: bookingLoading }] = useMutation(CREATE_BOOKING, {
    onCompleted: () => {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/my-bookings');
      }, 2000);
    },
    onError: (error) => {
      alert('Error membuat booking: ' + error.message);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !data?.room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error loading room</p>
          <button 
            onClick={() => navigate('/dashboard/rooms')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Kembali ke Daftar Ruangan
          </button>
        </div>
      </div>
    );
  }

  const room = data.room;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculatePrice = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const hours = Math.ceil((end - start) / (1000 * 60 * 60));
      return hours > 0 ? hours * room.pricePerHour : 0;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.startTime || !formData.endTime || !formData.purpose || !formData.attendees) {
      alert('Mohon lengkapi semua field');
      return;
    }

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);
    
    if (endTime <= startTime) {
      alert('Waktu selesai harus setelah waktu mulai');
      return;
    }

    if (parseInt(formData.attendees) > room.capacity) {
      alert(`Jumlah peserta melebihi kapasitas ruangan (${room.capacity} orang)`);
      return;
    }

    try {
      await createBooking({
        variables: {
          input: {
            roomId: id,
            startTime: formData.startTime,
            endTime: formData.endTime,
            purpose: formData.purpose,
            attendees: parseInt(formData.attendees)
          }
        }
      });
    } catch (err) {
      console.error('Booking error:', err);
    }
  };

  const totalPrice = calculatePrice();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md text-center">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Berhasil!</h3>
            <p className="text-gray-600 mb-4">
              Booking Anda sedang menunggu konfirmasi admin
            </p>
            <p className="text-sm text-gray-500">
              Mengalihkan ke halaman pemesanan...
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/dashboard/rooms')}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft size={20} className="mr-2" />
            Kembali ke Daftar Ruangan
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Room Details */}
          <div>
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <img
                src={room.images?.[0] || 'https://via.placeholder.com/800x600?text=Room'}
                alt={room.name}
                className="w-full h-96 object-cover"
              />
              {room.images && room.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {room.images.slice(1, 5).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${room.name} ${idx + 2}`}
                      className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Room Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin size={18} className="mr-2" />
                    <span>{room.location} - Lantai {room.floor}</span>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  room.status === 'AVAILABLE' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {room.status === 'AVAILABLE' ? 'Tersedia' : 'Tidak Tersedia'}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex items-center text-gray-700 mb-3">
                  <Users size={20} className="mr-3 text-indigo-600" />
                  <span className="font-medium">Kapasitas: {room.capacity} orang</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock size={20} className="mr-3 text-indigo-600" />
                  <span className="font-medium">
                    Rp {room.pricePerHour?.toLocaleString('id-ID')} / jam
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi</h3>
                <p className="text-gray-600 leading-relaxed">{room.description}</p>
              </div>

              {room.facilities && room.facilities.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Fasilitas</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.facilities.map((facility, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Form Booking</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waktu Mulai
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waktu Selesai
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    min={formData.startTime || new Date().toISOString().slice(0, 16)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah Peserta
                  </label>
                  <input
                    type="number"
                    name="attendees"
                    value={formData.attendees}
                    onChange={handleChange}
                    min="1"
                    max={room.capacity}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maksimal {room.capacity} orang
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tujuan/Keperluan
                  </label>
                  <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    rows="4"
                    required
                    placeholder="Jelaskan tujuan booking ruangan..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Price Summary */}
                {totalPrice > 0 && (
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Durasi</span>
                      <span className="font-semibold">
                        {Math.ceil((new Date(formData.endTime) - new Date(formData.startTime)) / (1000 * 60 * 60))} jam
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Harga per jam</span>
                      <span className="font-semibold">
                        Rp {room.pricePerHour?.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="border-t border-indigo-200 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-indigo-600">
                          Rp {totalPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bookingLoading || room.status !== 'AVAILABLE'}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {bookingLoading ? 'Memproses...' : 'Booking Sekarang'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Booking akan menunggu konfirmasi dari admin
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
