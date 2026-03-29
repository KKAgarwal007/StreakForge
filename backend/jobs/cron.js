import nodeCron from 'node-cron';
import User from '../models/User.js';

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Run every day at 23:59
nodeCron.schedule('59 23 * * *', async () => {
  console.log('Running daily cron job for missing days...');
  try {
    const todayStr = getLocalDateString();
    
    // Find all users who HAVEN'T marked today as done
    const users = await User.find({});
    
    for (const user of users) {
      const todayStatus = user.dailyStatus.get(todayStr);
      if (!todayStatus) {
        // Did not mark today
        user.dailyStatus.set(todayStr, 'missed');
        user.streak = 0; // reset streak
        user.lastUpdated = new Date();
        await user.save();
      }
    }
    console.log('Daily cron job finished.');
  } catch (error) {
    console.error('Error in daily cron job:', error);
  }
});

export default nodeCron;
