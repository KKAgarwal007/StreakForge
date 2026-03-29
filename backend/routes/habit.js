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
  if (streak >= 1 && !newBadges.includes('Bronze I')) newBadges.push('Bronze I');
  if (streak >= 7 && !newBadges.includes('Bronze II')) newBadges.push('Bronze II');
  if (streak >= 21 && !newBadges.includes('Bronze III')) newBadges.push('Bronze III');
  if (streak >= 30 && !newBadges.includes('Silver I')) newBadges.push('Silver I');
  if (streak >= 60 && !newBadges.includes('Silver II')) newBadges.push('Silver II');
  if (streak >= 90 && !newBadges.includes('Gold I')) newBadges.push('Gold I');
  if (streak >= 120 && !newBadges.includes('Gold II')) newBadges.push('Gold II');
  if (streak >= 150 && !newBadges.includes('Diamond I')) newBadges.push('Diamond I');
  if (streak >= 180 && !newBadges.includes('Diamond II')) newBadges.push('Diamond II');
  if (streak >= 240 && !newBadges.includes('Legendary')) newBadges.push('Legendary');
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
