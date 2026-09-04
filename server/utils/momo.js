const crypto = require('crypto');

const createMoMoPaymentUrl = ({ bookingCode, amount, orderInfo }) => {
  const partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMO_HOSTAY';
  const accessKey = process.env.MOMO_ACCESS_KEY || 'momo_access_key';
  const secretKey = process.env.MOMO_SECRET_KEY || 'momo_secret_key';
  const redirectUrl = process.env.MOMO_RETURN_URL || 'http://localhost:5173/payment/momo-return';
  const ipnUrl = process.env.MOMO_NOTIFY_URL || 'http://localhost:5000/api/payments/momo-ipn';

  const orderId = `${bookingCode}_${Date.now()}`;
  const requestId = orderId;
  const requestType = 'captureWallet';
  const extraData = '';

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

  // In sandbox simulation, we can redirect directly to redirectUrl or simulation gateway
  const payUrl = `${redirectUrl}?partnerCode=${partnerCode}&orderId=${orderId}&requestId=${requestId}&amount=${amount}&orderInfo=${encodeURIComponent(orderInfo)}&orderType=momo_wallet&transId=${Date.now()}&resultCode=0&message=Successful.&payType=qr&responseTime=${Date.now()}&extraData=&signature=${signature}`;

  return { payUrl, orderId, requestId, signature };
};

const verifyMoMoReturn = (query) => {
  const { resultCode, orderId, amount, transId } = query;
  return {
    isSuccess: resultCode === '0' || resultCode === 0,
    bookingCode: (orderId || '').split('_')[0],
    transactionNo: transId || `MOMO_${Date.now()}`,
    amount: parseInt(amount || '0')
  };
};

module.exports = { createMoMoPaymentUrl, verifyMoMoReturn };
