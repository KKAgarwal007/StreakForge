import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const getLocalDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const assignBadges = (streak, currentBadges) => {
  const newBadges = [...currentBadges];
  if (streak >= 3 && !newBadges.includes('Bronze')) newBadges.push('Bronze');
  if (streak >= 7 && !newBadges.includes('Silver')) newBadges.push('Silver');
  if (streak >= 14 && !newBadges.includes('Gold')) newBadges.push('Gold');
  if (streak >= 30 && !newBadges.includes('Diamond')) newBadges.push('Diamond');
  return newBadges;
};

router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const dailyStatus = user.dailyStatus ? Object.fromEntries(user.dailyStatus) : {};
    
    res.json({
      streak: user.streak,
      badges: user.badges,
      dailyStatus
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/mark', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const todayStr = getLocalDateString();
    
    const currentStatus = user.dailyStatus.get(todayStr);
    if (currentStatus === 'done') {
      return res.status(400).json({ message: 'Already marked for today' });
    }
    
    user.dailyStatus.set(todayStr, 'done');
    user.streak += 1;
    user.badges = assignBadges(user.streak, user.badges);
    user.lastUpdated = new Date();

    await user.save();

    res.json({
      message: 'Marked successfully',
      streak: user.streak,
      badges: user.badges,
      dailyStatus: Object.fromEntries(user.dailyStatus)
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
