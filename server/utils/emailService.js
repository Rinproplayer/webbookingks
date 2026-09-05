const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const { generateBookingPDF } = require('./pdfGenerator');
const Booking = require('../models/Booking');

let transporterInstance = null;

// Initialize Transporter
const getTransporter = async () => {
  if (transporterInstance) return transporterInstance;

  const emailUser = process.env.EMAIL_USER || 'nguyendangcap122005@gmail.com';
  const emailPass = process.env.EMAIL_PASS || 'hghstcjzmhwggeiz';

  if (emailUser && emailPass) {
    if (process.env.EMAIL_HOST) {
      transporterInstance = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_PORT === '465',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });
    } else {
      transporterInstance = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });
    }
    console.log('[EmailService] Configured with user:', emailUser);
  } else {
    console.log('[EmailService] No SMTP credentials in .env. Creating Ethereal test account...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporterInstance = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('[EmailService] Ethereal test account ready:', testAccount.user);
    } catch (err) {
      console.warn('[EmailService] Fallback to stream transport:', err.message);
      transporterInstance = nodemailer.createTransport({
        jsonTransport: true
      });
    }
  }

  return transporterInstance;
};

const formatCurrency = (amount) => {
  return (amount || 0).toLocaleString('vi-VN') + ' VNĐ';
};

const formatDateVN = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Send Booking Confirmation Email with PDF Attachment & QR Code
 * @param {string|Object} bookingInput 
 */
const sendBookingConfirmation = async (bookingInput) => {
  try {
    let booking = bookingInput;
    if (typeof bookingInput === 'string') {
      booking = await Booking.findById(bookingInput)
        .populate('hotel')
        .populate('room')
        .populate('customer');
    } else if (!booking.hotel?.name || !booking.room?.name) {
      booking = await Booking.findById(booking._id)
        .populate('hotel')
        .populate('room')
        .populate('customer');
    }

    if (!booking) {
      throw new Error('Booking not found for email confirmation');
    }

    const recipientEmail = booking.guestInfo?.email || booking.customer?.email;
    if (!recipientEmail) {
      console.warn('[EmailService] No recipient email found for booking:', booking.bookingCode);
      return { success: false, message: 'Khách hàng không có email' };
    }

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
      width: 180,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    });

    // Generate PDF Buffer
    let pdfBuffer = null;
    try {
      pdfBuffer = await generateBookingPDF(booking);
    } catch (pdfErr) {
      console.error('[EmailService] Error generating PDF ticket:', pdfErr);
    }

    const transporter = await getTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"Hostay Đà Nẵng" <no-reply@hostay.vn>';

    const checkInStr = formatDateVN(booking.checkInDate);
    const checkOutStr = formatDateVN(booking.checkOutDate);
    const hotelName = booking.hotel?.name || 'Khách sạn tại Đà Nẵng';
    const hotelAddress = booking.hotel?.address || 'Đà Nẵng, Việt Nam';
    const roomName = booking.room?.name || 'Phòng tiêu chuẩn';
    const guestName = booking.guestInfo?.name || 'Quý khách';

    const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận đặt phòng - Hostay Đà Nẵng</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0 0 6px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 13px; color: #ccfbf1; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-top: 12px; }
    .content { padding: 28px 24px; }
    .alert-box { background: #ecfdf5; border-left: 4px solid #10b981; padding: 14px 16px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; color: #065f46; }
    .section-title { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
    .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
    .info-label { color: #64748b; }
    .info-value { font-weight: 600; color: #0f172a; text-align: right; }
    .qr-section { text-align: center; background: #f8fafc; border: 2px dashed #0d9488; border-radius: 16px; padding: 20px; margin: 24px 0; }
    .qr-img { width: 160px; height: 160px; border-radius: 12px; background: white; padding: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .booking-code { font-family: monospace; font-size: 18px; font-weight: 800; color: #0d9488; margin-top: 8px; }
    .price-total { font-size: 18px; font-weight: 800; color: #0d9488; }
    .btn { display: inline-block; background: #0d9488; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 13px; text-align: center; margin-top: 10px; }
    .footer { background: #0f172a; color: #94a3b8; text-align: center; padding: 24px; font-size: 12px; line-height: 1.6; }
    .footer a { color: #2dd4bf; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>HOSTAY ĐÀ NẴNG</h1>
      <p>Hệ thống đặt phòng Khách sạn & Homestay Đà Nẵng</p>
      <div class="badge">ĐÃ THANH TOÁN &bull; XÁC NHẬN TỨC THÌ</div>
    </div>

    <div class="content">
      <div class="alert-box">
        <strong>Kính gửi ${guestName},</strong><br>
        Hostay xin trân trọng thông báo đơn đặt phòng của Quý khách đã được xác nhận thành công! File vé điện tử PDF đính kèm đã sẵn sàng.
      </div>

      <!-- QR Code Check-in Section -->
      <div class="qr-section">
        <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">MÃ CHECK-IN TẠI QUẦY LỄ TÂN</p>
        <img src="cid:booking-qrcode" alt="QR Check-in" class="qr-img" />
        <div class="booking-code">${booking.bookingCode}</div>
        <p style="margin: 8px 0 0 0; font-size: 11px; color: #64748b;">Xuất trình mã QR này hoặc mở file PDF đính kèm khi đến khách sạn</p>
      </div>

      <!-- Hotel & Stay Info -->
      <div class="section-title">THÔNG TIN LƯU TRÚ</div>
      <div class="card">
        <div style="font-size: 16px; font-weight: 800; color: #0d9488; margin-bottom: 4px;">${hotelName}</div>
        <div style="font-size: 12px; color: #64748b; margin-bottom: 14px;">📍 ${hotelAddress}</div>

        <div class="info-row">
          <span class="info-label">Hạng phòng:</span>
          <span class="info-value">${roomName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Số lượng phòng:</span>
          <span class="info-value">${booking.roomQuantity || 1} phòng</span>
        </div>
        <div class="info-row">
          <span class="info-label">Số đêm lưu trú:</span>
          <span class="info-value">${booking.nights || 1} đêm</span>
        </div>
        <div class="info-row">
          <span class="info-label">Nhận phòng (Check-in):</span>
          <span class="info-value" style="color: #0d9488;">Từ 14:00, ${checkInStr}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Trả phòng (Check-out):</span>
          <span class="info-value" style="color: #e11d48;">Trước 12:00, ${checkOutStr}</span>
        </div>
      </div>

      <!-- Guest and Price Details -->
      <div class="section-title">CHI TIẾT THANH TOÁN</div>
      <div class="card">
        <div class="info-row">
          <span class="info-label">Khách đại diện:</span>
          <span class="info-value">${guestName} (${booking.guestInfo?.phone || ''})</span>
        </div>
        <div class="info-row">
          <span class="info-label">Giá niêm yết:</span>
          <span class="info-value">${formatCurrency(booking.pricing?.originalTotal)}</span>
        </div>
        ${booking.pricing?.discountAmount > 0 ? `
        <div class="info-row">
          <span class="info-label">Ưu đãi giảm giá / Voucher:</span>
          <span class="info-value" style="color: #10b981;">- ${formatCurrency(booking.pricing.discountAmount)}</span>
        </div>
        ` : ''}
        <div class="info-row" style="border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 8px;">
          <span class="info-label" style="font-weight: 700; color: #0f172a;">Tổng tiền đã thanh toán:</span>
          <span class="price-total">${formatCurrency(booking.pricing?.finalTotal)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Hình thức thanh toán:</span>
          <span class="info-value" style="text-transform: uppercase;">${booking.paymentMethod || 'Trực tuyến'} (Thành công)</span>
        </div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 24px 0;">
        <a href="https://ntnguyen.id.vn/ticket/${booking.bookingCode}" class="btn">
          Mở Vé Điện Tử Trực Tuyến &rarr;
        </a>
      </div>

      <div style="font-size: 12px; color: #64748b; line-height: 1.6;">
        <strong>Lưu ý quan trọng:</strong><br>
        &bull; Quý khách vui lòng mang theo Căn cước công dân / Hộ chiếu bản gốc khi làm thủ tục.<br>
        &bull; Cần hỗ trợ check-in sớm hoặc xe đưa đón sân bay Đà Nẵng, vui lòng liên hệ hotline khách sạn hoặc phản hồi email này.
      </div>
    </div>

    <div class="footer">
      <strong>Hostay Đà Nẵng - Nền tảng Đặt phòng & Du lịch Thông minh</strong><br>
      Website: <a href="https://ntnguyen.id.vn">https://ntnguyen.id.vn</a> | Hotline: 0905.123.456<br>
      Địa chỉ: Sơn Trà & Hải Châu, TP. Đà Nẵng, Việt Nam
    </div>
  </div>
</body>
</html>
    `;

    const attachments = [
      {
        filename: 'qrcode.png',
        content: qrBuffer,
        cid: 'booking-qrcode'
      }
    ];

    if (pdfBuffer) {
      attachments.push({
        filename: `Ve-Dien-Tu-Hostay-${booking.bookingCode}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      });
    }

    const mailOptions = {
      from: fromAddress,
      to: recipientEmail,
      subject: `[Hostay] Xác nhận đặt phòng thành công & Vé điện tử #${booking.bookingCode} - ${hotelName}`,
      html: htmlContent,
      attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[EmailService] Confirmation email sent successfully to:', recipientEmail, 'MessageId:', info.messageId);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('[EmailService] 🌐 Ethereal Email Preview URL:', previewUrl);
    }

    booking.confirmationEmailSent = true;
    booking.confirmationEmailSentAt = new Date();
    await booking.save();

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || null
    };
  } catch (error) {
    console.error('[EmailService] Failed to send booking confirmation email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send 1-Day Pre-Checkin Reminder Email
 * @param {string|Object} bookingInput 
 */
const sendCheckInReminder = async (bookingInput) => {
  try {
    let booking = bookingInput;
    if (typeof bookingInput === 'string') {
      booking = await Booking.findById(bookingInput)
        .populate('hotel')
        .populate('room')
        .populate('customer');
    } else if (!booking.hotel?.name || !booking.room?.name) {
      booking = await Booking.findById(booking._id)
        .populate('hotel')
        .populate('room')
        .populate('customer');
    }

    if (!booking) return { success: false, message: 'Booking not found' };

    const recipientEmail = booking.guestInfo?.email || booking.customer?.email;
    if (!recipientEmail) return { success: false, message: 'Recipient email missing' };

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
      width: 180,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    });

    const transporter = await getTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"Hostay Đà Nẵng" <no-reply@hostay.vn>';

    const checkInStr = formatDateVN(booking.checkInDate);
    const hotelName = booking.hotel?.name || 'Khách sạn tại Đà Nẵng';
    const hotelAddress = booking.hotel?.address || 'Đà Nẵng, Việt Nam';
    const guestName = booking.guestInfo?.name || 'Quý khách';

    const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Nhắc lịch nhận phòng ngày mai - Hostay Đà Nẵng</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 30px 24px; text-align: center; color: #ffffff; }
    .content { padding: 24px; }
    .card { background: #f1f5f9; border-radius: 12px; padding: 16px; margin: 16px 0; }
    .qr-section { text-align: center; background: #f0fdfa; border: 2px dashed #14b8a6; border-radius: 16px; padding: 18px; margin: 20px 0; }
    .qr-img { width: 150px; height: 150px; background: white; padding: 6px; border-radius: 8px; }
    .btn { display: inline-block; background: #0d9488; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 13px; text-align: center; margin-top: 10px; }
    .tip-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 14px; border-radius: 6px; font-size: 12.5px; color: #92400e; margin-top: 16px; }
    .footer { background: #0f172a; color: #94a3b8; text-align: center; padding: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0 0 6px 0; font-size: 22px;">NGÀY MAI LÀ NGÀY NHẬN PHÒNG!</h2>
      <p style="margin: 0; font-size: 13px; color: #ccfbf1;">Hostay Đà Nẵng rất hân hạnh được chào đón Quý khách</p>
    </div>

    <div class="content">
      <p>Kính gửi <strong>${guestName}</strong>,</p>
      <p style="font-size: 13.5px; line-height: 1.6;">
        Hostay xin gửi lời nhắc: <strong>Ngày mai (${checkInStr})</strong> là ngày Quý khách nhận phòng tại <strong>${hotelName}</strong>. 
        Mọi công tác chuẩn bị phòng ốc sạch sẽ, tiện nghi đã sẵn sàng!
      </p>

      <div class="card">
        <div style="font-weight: 700; font-size: 15px; color: #0d9488;">${hotelName}</div>
        <div style="font-size: 12.5px; color: #64748b; margin-top: 4px;">📍 ${hotelAddress}</div>
        <div style="font-size: 13px; margin-top: 10px;">
          ⏰ <strong>Giờ nhận phòng tiêu chuẩn:</strong> Từ 14:00 chiều mai.<br>
          🔑 <strong>Mã đặt phòng:</strong> <span style="font-family: monospace; font-weight: 800; color: #0d9488;">${booking.bookingCode}</span>
        </div>
      </div>

      <div class="qr-section">
        <div style="font-size: 11px; font-weight: 700; color: #0d9488; text-transform: uppercase; margin-bottom: 8px;">MÃ QR CHECK-IN NHANH TẠI QUẦY</div>
        <img src="cid:booking-qrcode" alt="QR Code" class="qr-img" />
        <div style="font-size: 11px; color: #64748b; margin-top: 6px;">Lễ tân sẽ quét mã này để hoàn tất thủ tục nhận chìa khóa phòng trong 30 giây</div>
      </div>

      <div class="tip-box">
        💡 <strong>Mẹo du lịch Đà Nẵng:</strong><br>
        &bull; Quý khách nên chuẩn bị trang phục nhẹ nhàng, kem chống nắng khi tham quan biển Mỹ Khê và Bán đảo Sơn Trà.<br>
        &bull; Cầu Rồng sẽ phun lửa và phun nước vào lúc 21:00 các tối Thứ Sáu, Thứ Bảy và Chủ Nhật!
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <a href="https://ntnguyen.id.vn/ticket/${booking.bookingCode}" class="btn">Xem Vé Điện Tử & Bản Đồ Điểm Đến &rarr;</a>
      </div>
    </div>

    <div class="footer">
      Hotline hỗ trợ Hostay: 0905.123.456 | Website: https://ntnguyen.id.vn<br>
      Chúc Quý khách có một kỳ nghỉ tuyệt vời tại thành phố đáng sống Đà Nẵng!
    </div>
  </div>
</body>
</html>
    `;

    const mailOptions = {
      from: fromAddress,
      to: recipientEmail,
      subject: `[Hostay] Nhắc lịch nhận phòng ngày mai tại ${hotelName} (Mã #${booking.bookingCode})`,
      html: htmlContent,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrBuffer,
          cid: 'booking-qrcode'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[EmailService] Reminder email sent to:', recipientEmail, 'MessageId:', info.messageId);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('[EmailService] 🌐 Ethereal Reminder Preview URL:', previewUrl);
    }

    booking.reminderEmailSent = true;
    booking.reminderEmailSentAt = new Date();
    await booking.save();

    return { success: true, messageId: info.messageId, previewUrl: previewUrl || null };
  } catch (error) {
    console.error('[EmailService] Failed to send check-in reminder:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmation,
  sendCheckInReminder
};
