const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userID: String,
  paymentId: String,
  payerId: String,
  paymentToken: String,
  paymentAmount: Number,
  paymentCurrency: String,
  paymentStatus: String,
  paymentType: String,
  createTime: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;