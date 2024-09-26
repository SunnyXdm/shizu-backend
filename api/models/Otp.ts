// otp model

import { Schema, model } from 'mongoose';

const otpSchema = new Schema({
  otp: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Otp = model('Otp', otpSchema);

export default Otp;
