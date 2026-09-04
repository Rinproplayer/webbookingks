import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function ImageUploader({ 
  value = '', 
  onChange, 
  label = 'Ảnh đại diện',
  multiple = false,
  values = [],
  onMultipleChange
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeMode, setActiveMode] = useState('upload'); // 'upload' | 'url'
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleUploadFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn tệp tin định dạng hình ảnh (PNG, JPG, WEBP,...)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Dung lượng tệp không được vượt quá 10MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        if (multiple && onMultipleChange) {
          onMultipleChange([...values, res.data.url]);
        } else if (onChange) {
          onChange(res.data.url);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Lỗi khi tải ảnh lên máy chủ');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleUploadFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadFile(e.target.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    if (multiple && onMultipleChange) {
      onMultipleChange([...values, urlInput.trim()]);
    } else if (onChange) {
      onChange(urlInput.trim());
    }
    setUrlInput('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 block">{label}</label>
        <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px]">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2 py-0.5 rounded-md font-bold transition-all ${
              activeMode === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Tải từ máy tính
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2 py-0.5 rounded-md font-bold transition-all ${
              activeMode === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Dán link ảnh (URL)
          </button>
        </div>
      </div>

      {error && (
        <p className="text-[11px] text-red-600 font-medium">{error}</p>
      )}

      {/* Upload Mode */}
      {activeMode === 'upload' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/70 scale-[1.01]'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {uploading ? (
            <div className="py-3 flex flex-col items-center justify-center gap-2 text-blue-600">
              <Loader2 className="w-7 h-7 animate-spin" />
              <span className="text-xs font-bold">Đang tải ảnh lên máy chủ...</span>
            </div>
          ) : (
            <div className="py-2 flex flex-col items-center justify-center gap-1.5 text-slate-500">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Kéo và thả ảnh vào đây, hoặc <span className="text-blue-600 underline">chọn từ máy tính</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Hỗ trợ PNG, JPG, JPEG, WEBP (Tối đa 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* URL Mode */
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Dán đường dẫn ảnh: https://images.unsplash.com/..."
            className="flex-1 text-xs p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900"
          >
            Áp dụng
          </button>
        </div>
      )}

      {/* Single Preview */}
      {!multiple && value && (
        <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200 group h-36 bg-slate-100 flex items-center justify-center">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <span className="text-[11px] text-white font-bold bg-slate-900/80 px-2 py-1 rounded-lg">
              Ảnh hiện tại
            </span>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Multiple Preview */}
      {multiple && values && values.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {values.map((url, idx) => (
            <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 h-20 group">
              <img src={url} alt="img" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onMultipleChange(values.filter((_, i) => i !== idx))}
                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
