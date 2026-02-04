import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_BOOKING } from '../graphql/mutations';
import { X, Calendar, Users, FileText } from 'lucide-react';

export default function EditBookingModal({ booking, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    startTime: booking.startTime.slice(0, 16), // Format for datetime-local
    endTime: booking.endTime.slice(0, 16),
    purpose: booking.purpose,
    attendees: booking.attendees
  });

  const [updateBooking, { loading }] = useMutation(UPDATE_BOOKING, {
    onCompleted: () => {
      alert('Booking berhasil diupdate!');
      onSuccess();
    },
    onError: (error) => {
      alert('Error: ' + error.message);
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);

    if (endTime <= startTime) {
      alert('Waktu selesai harus setelah waktu mulai');
      return;
    }

    if (parseInt(formData.attendees) > booking.room.capacity) {
      alert(`Jumlah peserta melebihi kapasitas ruangan (${booking.room.capacity} orang)`);
      return;
    }

    try {
      await updateBooking({
        variables: {
          id: booking.id,
          input: {
            startTime: formData.startTime,
            endTime: formData.endTime,
            purpose: formData.purpose,
            attendees: parseInt(formData.attendees)
          }
        }
      });
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const calculatePrice = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const hours = Math.ceil((end - start) / (1000 * 60 * 60));
      return hours > 0 ? hours * booking.room.pricePerHour : 0;
    }
    return booking.totalPrice;
  };

  const totalPrice = calculatePrice();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Booking</h2>
            <p className="text-sm text-gray-600 mt-1">{booking.room.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Time Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Waktu Mulai
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Waktu Selesai
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                min={formData.startTime || new Date().toISOString().slice(0, 16)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Attendees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users size={16} className="inline mr-2" />
              Jumlah Peserta
            </label>
            <input
              type="number"
              name="attendees"
              value={formData.attendees}
              onChange={handleChange}
              min="1"
              max={booking.room.capacity || 100}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maksimal {booking.room.capacity || 100} orang
            </p>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Tujuan/Keperluan
            </label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              rows="4"
              required
              placeholder="Jelaskan tujuan booking ruangan..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  Rp {booking.room.pricePerHour?.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="border-t border-indigo-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Baru</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Perubahan booking akan menunggu konfirmasi ulang dari admin
          </p>
        </form>
      </div>
    </div>
  );
}
