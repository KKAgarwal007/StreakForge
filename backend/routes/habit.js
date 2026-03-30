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

const calculateConsistency = (dailyStatusMap) => {
  let done = 0;
  let leave = 0;
  let missed = 0;
  
  for (const status of dailyStatusMap.values()) {
    if (status === 'done') done++;
    else if (status === 'leave') leave++;
    else if (status === 'missed') missed++;
  }
  
  const totalDays = done + leave + missed;
  if (totalDays === 0) return 0;
  return done / totalDays;
};

const assignBadges = (streak, currentBadges, consistency) => {
  if (consistency < 0.8) return currentBadges;
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
    const consistency = user.dailyStatus ? calculateConsistency(user.dailyStatus) : 0;
    
    res.json({
      streak: user.streak,
      badges: user.badges,
      dailyStatus,
      consistency
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/mark', auth, async (req, res) => {
  try {
    const { action = 'done' } = req.body;
    if (!['done', 'leave'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const todayStr = getLocalDateString();
    
    const currentStatus = user.dailyStatus.get(todayStr);
    if (currentStatus) {
      return res.status(400).json({ message: 'Action already taken for today' });
    }

    if (action === 'leave') {
      // Check for max 2 leaves in past 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      let leaveCount = 0;
      for (const [dateStr, status] of user.dailyStatus.entries()) {
        if (status === 'leave' && new Date(dateStr) >= thirtyDaysAgo) {
          leaveCount++;
        }
      }
      
      if (leaveCount >= 2) {
        return res.status(400).json({ message: 'Maximum 2 leaves per 30 days reached' });
      }
    }
    
    user.dailyStatus.set(todayStr, action);
    
    if (action === 'done') {
      user.streak += 1;
    }
    
    const consistency = calculateConsistency(user.dailyStatus);
    user.badges = assignBadges(user.streak, user.badges, consistency);
    user.lastUpdated = new Date();

    await user.save();

    res.json({
      message: 'Marked successfully',
      streak: user.streak,
      badges: user.badges,
      dailyStatus: Object.fromEntries(user.dailyStatus),
      consistency
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
