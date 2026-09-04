import React, { useState } from 'react';
import { Star, X, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import ImageUploader from './ImageUploader';

export default function ReviewModal({ booking, isOpen, onClose, onSuccess }) {
  const [ratings, setRatings] = useState({
    cleanliness: 5,
    location: 5,
    service: 5,
    amenities: 5,
    value: 5
  });
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !booking) return null;

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const overall = Number(
        ((ratings.cleanliness + ratings.location + ratings.service + ratings.amenities + ratings.value) / 5).toFixed(1)
      );

      const res = await api.post('/reviews', {
        bookingId: booking._id,
        ratings: { ...ratings, overall },
        comment,
        images
      });

      if (res.data.success) {
        onSuccess(res.data.review);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const criteriaLabels = [
    { key: 'cleanliness', label: 'Mức độ sạch sẽ vệ sinh' },
    { key: 'location', label: 'Vị trí & đi lại thuận tiện' },
    { key: 'service', label: 'Thái độ phục vụ lễ tân' },
    { key: 'amenities', label: 'Tiện nghi & trang thiết bị' },
    { key: 'value', label: 'Giá trị so với chi phí' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">Đánh giá kỳ nghỉ lưu trú</h3>
            <p className="text-xs text-slate-500">{booking.hotel?.name} – Mã đơn: {booking.bookingCode}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Criteria Stars */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            {criteriaLabels.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">{label}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => handleRatingChange(key, star)}
                      className="p-0.5 focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= ratings[key]
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        } hover:scale-110 transition-transform`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1.5 w-4">{ratings[key]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Comment text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Chia sẻ trải nghiệm thực tế của bạn <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Khách sạn sạch sẽ không? Vị trí có tiện ra biển Mỹ Khê hay ngắm Cầu Rồng không? Bạn hài lòng nhất điểm nào..."
              className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Image Drag & Drop Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Đăng ảnh chụp thực tế tại phòng (Kéo thả hoặc tải từ máy tính)
            </label>
            <ImageUploader
              images={images}
              onChange={setImages}
              maxImages={5}
              placeholder="Kéo thả ảnh chụp vào đây hoặc bấm để chọn từ máy tính"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 disabled:opacity-50"
            >
              {loading ? 'Đang gửi...' : 'Gửi đánh giá xác thực'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
