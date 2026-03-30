import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  streak: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  lastUpdated: { type: Date, default: Date.now },
  dailyStatus: {
    type: Map,
    of: String, // 'done' | 'missed' | 'leave'
    default: {}
  }
});

export default mongoose.model('User', userSchema);
