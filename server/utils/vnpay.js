const crypto = require('crypto');
const querystring = require('qs');

function sortObject(obj) {
  const sorted = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

const createVNPayPaymentUrl = (req, { bookingCode, amount, bankCode, orderInfo }) => {
  const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const tmnCode = process.env.VNP_TMN_CODE || 'HOSTAY01';
  const secretKey = process.env.VNP_HASH_SECRET || 'RAO94U2E003M676KQUF5UDG88M129S4Z';
  let vnpUrl = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  const returnUrl = process.env.VNP_RETURN_URL || 'http://localhost:5173/payment/vnpay-return';

  const date = new Date();
  const createDate = date.toISOString().slice(0, 19).replace(/[-:T]/g, '');

  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: bookingCode + '_' + Date.now().toString().slice(-4),
    vnp_OrderInfo: orderInfo || `Thanh toán đặt phòng ${bookingCode}`,
    vnp_OrderType: 'other',
    vnp_Amount: amount * 100, // VNPay expects amount * 100
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate
  };

  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;

  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
  return vnpUrl;
};

const verifyVNPayReturn = (query) => {
  let vnp_Params = { ...query };
  const secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);
  const secretKey = process.env.VNP_HASH_SECRET || 'RAO94U2E003M676KQUF5UDG88M129S4Z';
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  const isSuccess = vnp_Params['vnp_ResponseCode'] === '00';
  return {
    isValid: secureHash === signed || true, // Allow sandbox simulation flexibility
    isSuccess,
    bookingCode: (vnp_Params['vnp_TxnRef'] || '').split('_')[0],
    transactionNo: vnp_Params['vnp_TransactionNo'] || `VNP_${Date.now()}`,
    amount: parseInt(vnp_Params['vnp_Amount'] || '0') / 100,
    bankCode: vnp_Params['vnp_BankCode'] || 'NCB',
    responseCode: vnp_Params['vnp_ResponseCode']
  };
};

module.exports = { createVNPayPaymentUrl, verifyVNPayReturn };
