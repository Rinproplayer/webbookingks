import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, QrCode, Search, Camera } from 'lucide-react';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [manualCode, setManualCode] = useState('');
  const [useCamera, setUseCamera] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    let scanner = null;
    if (isOpen && useCamera) {
      scanner = new Html5QrcodeScanner(
        'reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scanner.render(
        (decodedText) => {
          onScanSuccess(decodedText);
          scanner.clear();
          onClose();
        },
        (error) => {
          // ignore frame errors
        }
      );
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error(err));
      }
    };
  }, [isOpen, useCamera]);

  if (!isOpen) return null;

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScanSuccess(manualCode.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">Quét Mã QR Check-in Lễ Tân</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {useCamera ? (
            <div>
              <div id="reader" className="w-full rounded-2xl overflow-hidden border border-slate-200"></div>
              <button
                type="button"
                onClick={() => setUseCamera(false)}
                className="w-full mt-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
              >
                Chuyển sang nhập mã thủ công
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setUseCamera(true)}
                className="w-full py-4 border-2 border-dashed border-teal-300 bg-teal-50/50 rounded-2xl flex flex-col items-center justify-center text-teal-700 hover:bg-teal-50 transition-colors"
              >
                <Camera className="w-8 h-8 mb-1.5" />
                <span className="text-xs font-bold">Bật Camera để quét mã QR trên điện thoại khách</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase">Hoặc nhập mã vé</span>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Mã đặt phòng (VD: HT-2026-9A82) hoặc SĐT</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="HT-2026-..."
                    className="flex-1 uppercase font-mono text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Tìm
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
