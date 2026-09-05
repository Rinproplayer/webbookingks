const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Helper to remove accents if standard Helvetica font is used
const removeAccents = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

/**
 * Generate PDF Buffer for Booking E-ticket
 * @param {Object} booking - Fully populated booking document
 * @returns {Promise<Buffer>}
 */
const generateBookingPDF = async (booking) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Detect Unicode Font
      let hasUnicodeFont = false;
      const fontCandidates = [
        'C:\\Windows\\Fonts\\arial.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/dejavu/DejaVuSans.ttf'
      ];

      for (const fPath of fontCandidates) {
        if (fs.existsSync(fPath)) {
          doc.registerFont('MainFont', fPath);
          doc.font('MainFont');
          hasUnicodeFont = true;
          break;
        }
      }

      if (!hasUnicodeFont) {
        doc.font('Helvetica');
      }

      // Safe text renderer
      const t = (str) => (hasUnicodeFont ? (str || '') : removeAccents(str || ''));

      // Generate QR Code Buffer
      const qrPayload = JSON.stringify({
        code: booking.bookingCode,
        token: booking.qrCodeToken,
        guest: booking.guestInfo?.name,
        hotel: booking.hotel?.name,
        room: booking.room?.name,
        checkIn: booking.checkInDate,
        checkOut: booking.checkOutDate
      });

      const qrBuffer = await QRCode.toBuffer(qrPayload, {
        width: 140,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });

      // --- 1. HEADER BANNER ---
      const headerTop = 40;
      doc.rect(40, headerTop, 515, 80)
        .fill('#0d9488'); // Hostay Teal

      doc.fillColor('#ffffff');
      doc.fontSize(22).text(t('HOSTAY DA NANG'), 60, headerTop + 18);
      doc.fontSize(10).text(t('HE THONG DAT PHONG KHACH SAN & HOMESTAY DA NANG'), 60, headerTop + 45);

      // Booking Code Badge in Header
      doc.fontSize(10).text(t('MA DAT CHO:'), 380, headerTop + 20, { align: 'right', width: 155 });
      doc.fontSize(14).text(booking.bookingCode || 'HT-2026', 380, headerTop + 36, { align: 'right', width: 155 });
      doc.fontSize(9).text(t('TRANG THAI: DA XAC NHAN'), 380, headerTop + 54, { align: 'right', width: 155 });

      // --- 2. TITLE BAR ---
      let currentY = headerTop + 100;
      doc.fillColor('#0f172a');
      doc.fontSize(16).text(t('PHIEU XAC NHAN DAT PHONG DIEN TU (E-TICKET)'), 40, currentY, { align: 'center', width: 515 });
      
      currentY += 24;
      const issueDate = new Date().toLocaleDateString('vi-VN');
      doc.fillColor('#64748b').fontSize(9).text(
        t('Ngay phat hanh: ' + issueDate + ' | Ma he thong: ' + (booking._id || '')),
        40,
        currentY,
        { align: 'center', width: 515 }
      );

      // Horizontal Divider
      currentY += 20;
      doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(40, currentY).lineTo(555, currentY).stroke();

      // --- 3. TWO COLUMNS: QR CODE & HOTEL HIGHLIGHT ---
      currentY += 15;
      const colTop = currentY;

      // Left Box: QR Code
      doc.roundedRect(40, colTop, 160, 190, 8).fillAndStroke('#f8fafc', '#cbd5e1');
      doc.image(qrBuffer, 55, colTop + 15, { width: 130, height: 130 });
      doc.fillColor('#0f172a').fontSize(9).text(t('MA CHECK-IN TAI SANH'), 40, colTop + 155, { align: 'center', width: 160 });
      doc.fillColor('#64748b').fontSize(7.5).text(t('Trinh ma nay cho le tan khi den'), 40, colTop + 170, { align: 'center', width: 160 });

      // Right Box: Booking & Hotel Details
      const rightX = 215;
      const rightW = 340;
      doc.roundedRect(rightX, colTop, rightW, 190, 8).fillAndStroke('#ffffff', '#e2e8f0');

      doc.fillColor('#0d9488').fontSize(8.5).text(t('KHACH SAN / HOMESTAY'), rightX + 15, colTop + 12);
      doc.fillColor('#0f172a').fontSize(14).text(t(booking.hotel?.name || 'Khach san Da Nang'), rightX + 15, colTop + 24, { width: rightW - 30 });

      doc.fillColor('#64748b').fontSize(8.5).text(
        t('Dia chi: ' + (booking.hotel?.address || 'Da Nang, Viet Nam')),
        rightX + 15,
        colTop + 45,
        { width: rightW - 30 }
      );

      // Inner divider
      doc.strokeColor('#f1f5f9').lineWidth(1).moveTo(rightX + 15, colTop + 72).lineTo(rightX + rightW - 15, colTop + 72).stroke();

      // Key details grid
      const dY = colTop + 80;
      doc.fillColor('#64748b').fontSize(8).text(t('HANG PHONG:'), rightX + 15, dY);
      doc.fillColor('#0f172a').fontSize(9.5).text(t(booking.room?.name || 'Phong tieu chuan'), rightX + 15, dY + 12, { width: 150 });

      doc.fillColor('#64748b').fontSize(8).text(t('KHACH DAI DIEN:'), rightX + 175, dY);
      doc.fillColor('#0f172a').fontSize(9.5).text(t(booking.guestInfo?.name || 'Khach hang'), rightX + 175, dY + 12, { width: 145 });

      const dY2 = dY + 35;
      const checkInStr = new Date(booking.checkInDate).toLocaleDateString('vi-VN');
      const checkOutStr = new Date(booking.checkOutDate).toLocaleDateString('vi-VN');

      doc.fillColor('#64748b').fontSize(8).text(t('NHAN PHONG (CHECK-IN):'), rightX + 15, dY2);
      doc.fillColor('#0d9488').fontSize(9.5).text(checkInStr + ' (14:00)', rightX + 15, dY2 + 12);

      doc.fillColor('#64748b').fontSize(8).text(t('TRA PHONG (CHECK-OUT):'), rightX + 175, dY2);
      doc.fillColor('#e11d48').fontSize(9.5).text(checkOutStr + ' (12:00)', rightX + 175, dY2 + 12);

      const dY3 = dY2 + 35;
      const nights = booking.nights || 1;
      const roomQty = booking.roomQuantity || 1;
      doc.fillColor('#64748b').fontSize(8).text(t('SO DEM & SO PHONG:'), rightX + 15, dY3);
      doc.fillColor('#0f172a').fontSize(9).text(t(nights + ' dem | ' + roomQty + ' phong'), rightX + 15, dY3 + 12);

      const adults = booking.guestInfo?.adults || 2;
      const children = booking.guestInfo?.children || 0;
      doc.fillColor('#64748b').fontSize(8).text(t('SO KHACH:'), rightX + 175, dY3);
      doc.fillColor('#0f172a').fontSize(9).text(t(adults + ' nguoi lon, ' + children + ' tre em'), rightX + 175, dY3 + 12);

      // --- 4. PRICING & PAYMENT SUMMARY ---
      currentY = colTop + 205;
      doc.roundedRect(40, currentY, 515, 120, 8).fillAndStroke('#f8fafc', '#e2e8f0');

      doc.fillColor('#0f172a').fontSize(11).text(t('CHI TIET THANH TOAN'), 55, currentY + 12);

      const pY = currentY + 34;
      doc.fillColor('#64748b').fontSize(9).text(t('Gia phong niem yet:'), 55, pY);
      doc.fillColor('#0f172a').fontSize(9).text(((booking.pricing?.originalTotal || 0).toLocaleString('vi-VN')) + ' VND', 400, pY, { align: 'right', width: 140 });

      doc.fillColor('#64748b').fontSize(9).text(t('Giam gia / Uu dai voucher:'), 55, pY + 18);
      doc.fillColor('#16a34a').fontSize(9).text('- ' + ((booking.pricing?.discountAmount || 0).toLocaleString('vi-VN')) + ' VND', 400, pY + 18, { align: 'right', width: 140 });

      doc.strokeColor('#cbd5e1').lineWidth(0.5).moveTo(55, pY + 38).lineTo(540, pY + 38).stroke();

      doc.fillColor('#0f172a').fontSize(11).text(t('TONG SO TIEN DA THANH TOAN:'), 55, pY + 46);
      doc.fillColor('#0d9488').fontSize(13).text(((booking.pricing?.finalTotal || 0).toLocaleString('vi-VN')) + ' VND', 400, pY + 44, { align: 'right', width: 140 });

      const method = (booking.paymentMethod || 'MOCK').toUpperCase();
      doc.fillColor('#64748b').fontSize(8).text(
        t('Phuong thuc: ' + method + ' | Trang thai: DA THANH TOAN DU'),
        55,
        pY + 66
      );

      // --- 5. IMPORTANT NOTES & CHECK-IN POLICY ---
      currentY += 135;
      doc.roundedRect(40, currentY, 515, 110, 8).fillAndStroke('#ffffff', '#f1f5f9');

      doc.fillColor('#0f172a').fontSize(10).text(t('QUY DINH & HUONG DAN NHAN PHONG'), 55, currentY + 12);

      const notes = [
        t('1. Thoi gian nhan phong tieu chuan tu 14:00 va tra phong truoc 12:00.'),
        t('2. Quy khach vui long mang theo CCCD/Ho chieu va xuat trinh ma QR nay tai quay le tan.'),
        t('3. Ho tro 24/7 qua Hotline Hostay Da Nang: 0905.123.456 hoac Email: support@hostay.vn.'),
        t('4. Vi tri khach san duoc dinh vi chinh xac tren ban do Da Nang tai https://ntnguyen.id.vn.')
      ];

      let noteY = currentY + 30;
      notes.forEach(note => {
        doc.fillColor('#475569').fontSize(8).text(note, 55, noteY, { width: 485 });
        noteY += 16;
      });

      // --- 6. FOOTER ---
      doc.fillColor('#94a3b8').fontSize(7.5).text(
        t('Hostay Da Nang - Nen tang dat phong & trai nghiem du lich thong minh hang dau Da Nang | Website: ntnguyen.id.vn'),
        40,
        780,
        { align: 'center', width: 515 }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  generateBookingPDF
};
