const cron = require('node-cron');
const Booking = require('../models/Booking');
const { sendCheckInReminder } = require('./emailService');

/**
 * Scan database for bookings checking in tomorrow and send reminders
 */
const checkAndSendCheckInReminders = async () => {
  try {
    console.log('[Scheduler] Running check-in reminder scanner...');
    const now = new Date();
    // 24 hours from now to 36 hours from now
    const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const tomorrowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59, 999);

    const upcomingBookings = await Booking.find({
      status: { $in: ['confirmed', 'paid'] },
      paymentStatus: 'paid',
      reminderEmailSent: { $ne: true },
      checkInDate: { $gte: tomorrowStart, $lte: tomorrowEnd }
    })
      .populate('hotel')
      .populate('room')
      .populate('customer');

    console.log(`[Scheduler] Found ${upcomingBookings.length} bookings checking in tomorrow (${tomorrowStart.toLocaleDateString('vi-VN')})`);

    let sentCount = 0;
    for (const booking of upcomingBookings) {
      try {
        const result = await sendCheckInReminder(booking);
        if (result.success) {
          sentCount++;
          console.log(`[Scheduler] Sent check-in reminder for booking #${booking.bookingCode} to ${booking.guestInfo?.email || booking.customer?.email}`);
        }
      } catch (err) {
        console.error(`[Scheduler] Failed to send reminder for booking #${booking.bookingCode}:`, err.message);
      }
    }

    console.log(`[Scheduler] Check-in reminder scan completed. Successfully sent: ${sentCount}/${upcomingBookings.length}`);
    return { success: true, processed: upcomingBookings.length, sent: sentCount };
  } catch (error) {
    console.error('[Scheduler] Error in checkAndSendCheckInReminders:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Initialize Node-cron scheduler
 */
const initReminderScheduler = () => {
  // Run daily at 08:00 AM Vietnam time (ICT = UTC+7)
  // Cron format: minute hour day-of-month month day-of-week
  cron.schedule('0 8 * * *', async () => {
    console.log('[Scheduler] Triggering scheduled daily 08:00 AM check-in reminder task...');
    await checkAndSendCheckInReminders();
  }, {
    timezone: 'Asia/Ho_Chi_Minh'
  });

  console.log('[Scheduler] ⏰ Pre-check-in email reminder scheduler initialized (daily at 08:00 AM ICT).');
};

module.exports = {
  initReminderScheduler,
  checkAndSendCheckInReminders
};
